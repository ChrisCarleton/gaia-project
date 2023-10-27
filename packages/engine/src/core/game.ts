import { EventArgs, FactionType, Map, PlayerFactory, RoundBooster } from '..';
import {
  ErrorCode,
  EventHandler,
  EventType,
  GPError,
  GameContext,
  GameState,
  MapHex,
  Observer,
  PlanetType,
  Player,
  State,
} from '..';
import {
  BuildFirstMinesPass,
  BuildFirstMinesState,
} from '../states/build-first-mines-state';
import { GameNotStartedState } from '../states/game-not-started-state';
import { loadState } from '../states/load-state';
import { DefaultGameContext } from './game-context';
import { GameMap } from './maps';
import { RoundBoosters } from './round-boosters';
import {
  GameContextSchema,
  SerializedGameContext,
  SerializedState,
} from './serialization';

type ReloadOptions = {
  gameData: SerializedGameContext;
  players: Player[];
};

export class Game implements State {
  private readonly _events: Observer;
  private _context: GameContext | undefined;
  private _state: State;

  private constructor(events: Observer, reload?: ReloadOptions) {
    this._events = events;
    events.subscribe(
      EventType.AwaitingPlayerInput,
      this.onAwaitingPlayerInput.bind(this),
    );
    this._state = new GameNotStartedState();

    if (reload) {
      this._context = this.reloadGameContext(reload);
      this._state = loadState(
        reload.gameData.currentState,
        this._context,
        events,
        this.changeState,
      );
    }

    if (!this._state) {
      this._state = new GameNotStartedState();
    }
  }

  private reloadGameContext({ gameData, players }: ReloadOptions): GameContext {
    const map = new GameMap(
      gameData.map.map((hex) => {
        const { q, r } = hex.location;
        return {
          location: [q, r],
          planet: hex.planet
            ? {
                type: hex.planet.type,
                hasLantidMine: hex.planet.hasLantidMine,
                player: hex.planet.player
                  ? players[hex.planet.player]
                  : undefined,
                structure: hex.planet.structure,
              }
            : undefined,
          hasIvitsStation: hex.hasIvitsStation,
        };
      }),
    );

    const context = new DefaultGameContext(map, players);

    context.currentPlayer = players[gameData.currentPlayer];
    context.currentRound = gameData.currentRound;

    return context;
  }

  get currentState(): GameState {
    return this._state.currentState ?? GameState.GameNotStarted;
  }

  get context(): Readonly<GameContext> {
    if (!this._context) {
      throw new Error('The game has not been properly initialized.');
    }

    return this._context;
  }

  beginGame(players: Player[], map: Map) {
    this.validatePlayers(players);

    // Shuffle the players into a random turn order for the first round.
    players = players.sort(() => Math.random() - 0.5);

    // Initialize the game context.
    this._context = new DefaultGameContext(map, players);

    // Select a random subset of round boosters.
    // We need a number of boosters equal to the number of players + 3.
    this._context.roundBoosters = [...RoundBoosters]
      .sort(() => Math.random() - 0.5)
      .slice(0, players.length + 3);

    // Set the initial state so that the players can place their first mines.
    this._state = new BuildFirstMinesState(
      this._context,
      this._events,
      this.changeState,
      {
        turnIndex: 0,
        pass: BuildFirstMinesPass.First,
      },
    );
    setTimeout(() => this._state.init(), 0);
  }

  subscribeToEvent(event: EventType, handler: EventHandler): void {
    this._events.subscribe(event, handler);
  }

  init(): void {
    /* TODO: Anything here? Constructor handles most things */
  }

  buildMine(location: MapHex): void {
    this._state.buildMine(location);
  }

  startGaiaProject(): void {
    this._state.startGaiaProject();
  }

  upgradeStructure(): void {
    this._state.upgradeStructure();
  }

  formFederation(): void {
    this._state.formFederation();
  }

  advanceResearch(): void {
    this._state.advanceResearch();
  }

  powerOrQicAction(): void {
    this._state.powerOrQicAction();
  }

  specialAction(): void {
    this._state.specialAction();
  }

  freeAction(): void {
    this._state.freeAction();
  }

  chooseRoundBoosterAndPass(roundBooster: RoundBooster): void {
    this._state.chooseRoundBoosterAndPass(roundBooster);
  }

  serialize(): SerializedGameContext {
    const playerIndexes: Record<string, number> = {};
    this.context.players.forEach((player, index) => {
      playerIndexes[player.id] = index;
    });

    return {
      currentPlayer: this.context.currentPlayer
        ? playerIndexes[this.context.currentPlayer.id]
        : -1,
      currentRound: this.context.currentRound,
      currentState: this._state.toJSON(),
      map: this.context.map.hexes().map((hex) => {
        const [q, r] = hex.location;
        return {
          location: { q, r },
          hasIvitsStation: hex.hasIvitsStation,
          planet: hex.planet
            ? {
                type: hex.planet.type,
                player: hex.planet.player
                  ? playerIndexes[hex.planet.player.id]
                  : undefined,
                hasLantidMine: hex.planet.hasLantidMine,
                structure: hex.planet.structure,
              }
            : undefined,
        };
      }),
      players: this.context.players.map((player) => ({
        faction: player.faction.factionType,
        id: player.id,
        name: player.name,
        powerCycle: {
          gaia: player.powerCycle.gaia,
          l1: player.powerCycle.level1,
          l2: player.powerCycle.level2,
          l3: player.powerCycle.level3,
        },
        research: player.research,
        resources: player.resources,
        vp: player.vp,
      })),
    };
  }

  private changeState(newState: State) {
    if (this._context) {
      this._state = newState;
      setTimeout(() => this._state.init(), 0);
    }
  }

  private validatePlayers(players: Player[]): void {
    // Validate player entries to make sure there are between 2-4 players
    // and that there are no conflicts in their choices of faction or homeworld.
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

      homeWorlds.add(player.faction.homeWorld);
      factions.add(player.faction.factionType);
    }
  }

  /*
   * Event handlers
   */
  private onAwaitingPlayerInput(eventArgs: EventArgs) {
    if (this._context && eventArgs.type === EventType.AwaitingPlayerInput) {
      if (eventArgs.player) this._context.currentPlayer = eventArgs.player;
      this._context.allowedActions = eventArgs.allowedActions;
    }
  }

  /*
   * Static methods for starting and loading games
   */
  static beginNewGame(players: Player[], map: Map, events: Observer): Game {
    const game = new Game(events);
    game.beginGame(players, map);
    return game;
  }

  static resumeGame(
    gameData: unknown,
    playerFactory: PlayerFactory,
    events: Observer,
  ): Game {
    const context = GameContextSchema.parse(gameData);

    const players = context.players.map((playerData) =>
      playerFactory.deserializePlayer(playerData),
    );

    return new Game(events, {
      gameData: context,
      players,
    });
  }

  toJSON(): SerializedState {
    return this._state.toJSON();
  }
}
