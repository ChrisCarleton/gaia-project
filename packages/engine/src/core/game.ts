import { EventArgs, FactionType } from '..';
import {
  ErrorCode,
  EventHandler,
  EventType,
  GPError,
  GameContext,
  GameState,
  MapHex,
  MapModel,
  Observer,
  PlanetType,
  Player,
  State,
} from '..';
import { BuildFirstMinesState } from '../states/build-first-mines-state';
import { GameContextInstance } from './game-context';

export class Game implements State {
  readonly _context: GameContextInstance;
  private readonly events: Observer;

  private _currentState: State;

  constructor(players: Player[], mapModel: MapModel, events: Observer) {
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

    events.subscribe(
      EventType.AwaitingPlayerInput,
      this.onAwaitingPlayerInput.bind(this),
    );

    // Shuffle the players into a random turn order for the first round.
    const shuffledPlayers = players.sort(() => Math.random() - 0.5);

    // Generate a map using the provided map model.
    const map = mapModel.createMap(shuffledPlayers.length);
    this.events = events;

    // Initialize the game context.
    this._context = new GameContextInstance(map, shuffledPlayers);

    // Set the initial state so that the players can place their first mines.
    this._currentState = new BuildFirstMinesState(
      this.context.players[0],
      this._context,
      this.events,
      this.changeState,
    );
  }

  get currentState(): GameState {
    return this._currentState.currentState;
  }

  get context(): Readonly<GameContext> {
    return this._context;
  }

  abortGame(): void {
    throw new Error('Method not implemented.');
  }

  subscribeToEvent(event: EventType, handler: EventHandler): void {
    this.events.subscribe(event, handler);
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

  pass(): void {
    this._currentState.pass();
  }

  doIncome(): void {
    this._currentState.doIncome();
  }

  completeGaiaProjects(): void {
    this._currentState.completeGaiaProjects();
  }

  doRoundCleanup(): void {
    this._currentState.doRoundCleanup();
  }

  doEndGameScoring(): void {
    this._currentState.doEndGameScoring();
  }

  private changeState(newState: State) {
    this._currentState = newState;
  }

  private onAwaitingPlayerInput(eventArgs: EventArgs) {
    if (eventArgs.type === EventType.AwaitingPlayerInput) {
      this._context.updateAwaitedAction(
        eventArgs.player,
        eventArgs.allowedActions,
      );
    }
  }
}
