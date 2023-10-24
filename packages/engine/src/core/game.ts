import { EventArgs, FactionType, Map, RoundBooster } from '..';
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
import { nextTick } from '../utils';
import {
  GameContextInstance,
  GameContextSchema,
  SerializedGameContext,
} from './game-context';
import { RoundBoosters } from './round-boosters';

export class Game implements State {
  private readonly _events: Observer;
  private _context: GameContext | undefined;

  private _currentState: State;

  private constructor(events: Observer, context?: GameContext) {
    this._events = events;
    this._currentState = new GameNotStartedState();
    events.subscribe(
      EventType.AwaitingPlayerInput,
      this.onAwaitingPlayerInput.bind(this),
    );
  }

  get currentState(): GameState {
    return this._currentState.currentState;
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
    this._context = new GameContextInstance(map, players);

    // Select a random subset of round boosters.
    // We need a number of boosters equal to the number of players + 3.
    this._context.roundBoosters = [...RoundBoosters]
      .sort(() => Math.random() - 0.5)
      .slice(0, players.length + 3);

    // Set the initial state so that the players can place their first mines.
    this._currentState = new BuildFirstMinesState(
      this._context,
      this._events,
      this.changeState,
      {
        turnIndex: 0,
        pass: BuildFirstMinesPass.First,
      },
    );
    nextTick(() => this._currentState.init());
  }

  subscribeToEvent(event: EventType, handler: EventHandler): void {
    this._events.subscribe(event, handler);
  }

  init(): void {
    /* TODO: Anything here? Constructor handles most things */
  }

  buildMine(location: MapHex): void {
    this._currentState.buildMine(location);
  }

  startGaiaProject(): void {
    this._currentState.startGaiaProject();
  }

  upgradeStructure(): void {
    this._currentState.upgradeStructure();
  }

  formFederation(): void {
    this._currentState.formFederation();
  }

  advanceResearch(): void {
    this._currentState.advanceResearch();
  }

  powerOrQicAction(): void {
    this._currentState.powerOrQicAction();
  }

  specialAction(): void {
    this._currentState.specialAction();
  }

  freeAction(): void {
    this._currentState.freeAction();
  }

  chooseRoundBoosterAndPass(roundBooster: RoundBooster): void {
    this._currentState.chooseRoundBoosterAndPass(roundBooster);
  }

  private changeState(newState: State) {
    this._currentState = newState;
    nextTick(() => newState.init());
  }

  toJSON(): SerializedGameContext {
    return {};
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

  static loadGameFromContext(context: unknown, events: Observer): Game {
    // TODO: Deserialize a serialized game context.
    // return new GameContextInstance()

    const parseResult = GameContextSchema.parse(context);
    throw new Error('Not implemented.');
  }
}
