import { ErrorCode, GPError } from '../errors';
import { EventArgs, EventType, Observer } from '../events';
import {
  AxialCoordinates,
  FactionType,
  GameAction,
  GameContext,
  Map,
  MapModel,
  PlanetType,
  Player,
  PlayerInfo,
  ResearchBoard,
  RoundBooster,
  RoundScoringBonus,
  StructureType,
} from '../interfaces';
import { PlayerFactory } from '../players';
import { axialToString, mapFromHexes } from '../utils';
import { RoundBoosters } from './round-boosters';
import { SerializedGameContext } from './serialization';

type NewGameOptions = {
  mapModel: MapModel;
  players: PlayerInfo[];
};

type ReloadGameOptions = {
  context: SerializedGameContext;
};

export type GameContextOptions = { events: Observer } & (
  | NewGameOptions
  | ReloadGameOptions
);

function isNewGame(
  obj: Partial<NewGameOptions & ReloadGameOptions>,
): obj is NewGameOptions {
  return !!obj.mapModel && !!obj.players;
}

export class DefaultGameContext implements GameContext {
  private readonly _events: Observer;

  private _allowedActions: Readonly<GameAction[]>;
  private _currentPlayer: Player;
  private _currentRound: number;
  private _map: Map;
  private _passOrder: Player[];
  private _players: Player[];
  private _researchBoard: ResearchBoard;
  private _roundBoosters: RoundBooster[];
  private _roundScoringBonuses: RoundScoringBonus[];

  constructor(options: GameContextOptions) {
    const playerFactory = new PlayerFactory(options.events);
    this._events = options.events;
    this._allowedActions = [];

    if (isNewGame(options)) {
      // Initialize the context with the defaults for a newly-started game.
      this._map = options.mapModel.createMap(options.players.length);

      let players = options.players.map((player) =>
        playerFactory.createPlayer(player.id, player.faction, player.name),
      );
      this.validatePlayers(players);

      // Shuffle the players into a random turn order for the first round.
      players = players.sort(() => Math.random() - 0.5);

      this._players = players;
      this._currentRound = 0; // Gets incremented at the start of every income phase.
      this._currentPlayer = this._players[0];
      this._passOrder = [];

      // Select a random subset of round boosters.
      // We need a number of boosters equal to the number of players + 3.
      this._roundBoosters = [...RoundBoosters]
        .sort(() => Math.random() - 0.5)
        .slice(0, players.length + 3);

      // And we need randomized round scoring bonuses for each of the six rounds.
      this._roundScoringBonuses = Object.values(RoundScoringBonus)
        .sort(() => Math.random() - 0.5)
        .slice(0, 6);
    } else {
      // Initialized the context with the deserialized properties.

      this._players = options.context.players.map((player) =>
        playerFactory.deserializePlayer(player, options.context),
      );

      const mapHexes = options.context.map.map((hex) => {
        const { q, r } = hex.location;
        return {
          location: [q, r] as AxialCoordinates,
          planet: hex.planet
            ? {
                type: hex.planet.type,
                hasLantidMine: hex.planet.hasLantidMine,
                player:
                  typeof hex.planet.player === 'number'
                    ? this._players[hex.planet.player]
                    : undefined,
                structure: hex.planet.structure,
              }
            : undefined,
          hasIvitsStation: hex.hasIvitsStation,
        };
      });
      this._map = mapFromHexes(mapHexes);

      this._passOrder = options.context.passOrder.map((i) => this._players[i]);
      this._currentPlayer = this._players[options.context.currentPlayer];
      this._currentRound = options.context.currentRound;
      this._roundBoosters = [...options.context.roundBoosters];
      this._roundScoringBonuses = options.context.roundScoringBonuses;
    }

    // TODO: Refactor this stuff once it's built out... also it should really be called something like "TechTiles" rather than "ResearchBoard"
    const researchTrack = {
      advancedTechTile: {},
      standardTechTiles: [],
    };
    this._researchBoard = {
      terraformingFederationToken: {},
      researchTracks: {
        ai: { ...researchTrack },
        navigation: { ...researchTrack },
        gaia: { ...researchTrack },
        economics: { ...researchTrack },
        science: { ...researchTrack },
        terraforming: { ...researchTrack },
      },
    };

    // Subscribe to relevant events.
    this._events.subscribe(
      EventType.AwaitingPlayerInput,
      this.onAwaitingPlayerInput.bind(this),
    );
    this._events.subscribe(EventType.BeginRound, this.onBeginRound.bind(this));
    this._events.subscribe(
      EventType.RoundBoosterSelected,
      this.onRoundBoosterSelected.bind(this),
    );
    this._events.subscribe(
      EventType.MineBuilt,
      this.onStructurePlaced.bind(this),
    );
    this._events.subscribe(
      EventType.StructureBuilt,
      this.onStructurePlaced.bind(this),
    );
  }

  get allowedActions(): Readonly<GameAction[]> {
    return this._allowedActions;
  }

  get currentPlayer(): Readonly<Player> {
    return this._currentPlayer;
  }

  get currentRound(): number {
    return this._currentRound;
  }

  get players(): Player[] {
    return this._players;
  }

  get passOrder(): Player[] {
    return this._passOrder;
  }

  get roundBoosters(): RoundBooster[] {
    return this._roundBoosters;
  }
  set roundBoosters(val: RoundBooster[]) {
    this._roundBoosters = val;
  }

  get roundScoringBonuses(): Readonly<RoundScoringBonus[]> {
    return this._roundScoringBonuses;
  }

  get researchBoard(): Readonly<ResearchBoard> {
    return this._researchBoard;
  }

  get map(): Readonly<Map> {
    return this._map;
  }

  private validatePlayers(players: Player[]): void {
    // Validate player entries to make sure that
    //   a) there are between 2-4 players.
    //   b) there are no conflicts in their choices of faction or homeworld.
    //   c) they have distinct IDs.
    if (players.length < 2) {
      throw new GPError(
        ErrorCode.TooFewPlayers,
        'At least two players must join the game.',
      );
    }

    if (players.length > 4) {
      throw new GPError(
        ErrorCode.TooManyPlayers,
        'No more than four players may join the game.',
      );
    }

    const homeWorlds = new Set<PlanetType>();
    const factions = new Set<FactionType>();
    const ids = new Set<string>();

    for (const player of players) {
      if (factions.has(player.faction.factionType)) {
        throw new GPError(
          ErrorCode.FactionConflict,
          'Two or more players have selected the same faction.',
        );
      }

      if (homeWorlds.has(player.faction.homeWorld)) {
        throw new GPError(
          ErrorCode.FactionConflict,
          'Two or more players have selected factions with the same type of home world.',
        );
      }

      if (ids.has(player.id)) {
        throw new Error(`Players have conflicting IDs: ${player.id}`);
      }

      homeWorlds.add(player.faction.homeWorld);
      factions.add(player.faction.factionType);
      ids.add(player.id);
    }
  }

  /** Event Handlers */

  // Set current player and allowed actions when a player is asked for input.
  private onAwaitingPlayerInput(e: EventArgs) {
    if (e.type === EventType.AwaitingPlayerInput) {
      if (e.player) this._currentPlayer = e.player;
      this._allowedActions = e.allowedActions;
    }
  }

  // Advance the round number when a new round begins.
  // Also, turn order changes based on the pass order of the previous round!
  // TODO: Does any cleanup need to happen?
  private onBeginRound(e: EventArgs) {
    if (e.type === EventType.BeginRound) {
      this._currentRound = e.round;

      if (this._passOrder.length) {
        this._players = this._passOrder;
        this._passOrder = [];
      }
    }
  }

  // Update the map to place the new structure.
  private onStructurePlaced(e: EventArgs) {
    if (e.type === EventType.MineBuilt) {
      const mapKey = axialToString(e.location.location);
      const hex = this._map[mapKey];
      if (hex && hex.planet) {
        hex.planet.player = e.player;
        hex.planet.structure = StructureType.Mine;
      }
    }

    if (e.type === EventType.StructureBuilt) {
      // TODO
    }
  }

  // Player has selected a round booster from the supply.
  private onRoundBoosterSelected(e: EventArgs) {
    if (e.type === EventType.RoundBoosterSelected) {
      // Find the requested round booster and remove it from the supply.
      const index = this._roundBoosters.findIndex(
        (rb) => rb.id === e.roundBooster.id,
      );
      if (index > -1) {
        this._roundBoosters.splice(index, 1);
      }

      // If the player is currently in possession of a round booster, return it to the supply.
      if (e.previousRoundBooster) {
        this._roundBoosters.push(e.previousRoundBooster);
      }

      // If the game is in progress - i.e. a player is passing at the end of a round rather than just
      // choosing their first booster - then this action counts as a "pass".
      // Place the player in the passOrder array to lock in their position in turn order for the next round.
      if (this._currentRound > 0) {
        this._passOrder.push(e.player);
      }
    }
  }
}
