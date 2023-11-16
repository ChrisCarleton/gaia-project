import { ErrorCode, GPError } from '../errors';
import {
  DelayedObserver,
  LocalObserver,
  Observer,
  ObserverPublisher,
} from '../events';
import {
  GameContext,
  GameState,
  MapHex,
  MapModel,
  PlayerInfo,
  ResearchArea,
  RoundBooster,
  State,
} from '../interfaces';
import { BuildFirstMinesState } from '../states/build-first-mines-state';
import { BuildFirstMinesPass } from '../states/build-first-mines-turn-order';
import { GameNotStartedState } from '../states/game-not-started-state';
import { loadState } from '../states/load-state';
import { GameConfig } from './config';
import { DefaultGameContext } from './game-context';
import {
  GameContextSchema,
  SerializedGameContext,
  SerializedState,
} from './serialization';

export class Game implements State {
  private readonly _events: ObserverPublisher;
  private readonly _delayedEvents: Observer;
  private readonly _config: GameConfig | undefined;
  private _context: GameContext | undefined;
  private _state: State;

  constructor(config?: GameConfig) {
    this._events = new LocalObserver();
    this._delayedEvents = new DelayedObserver(this._events);
    this._state = new GameNotStartedState();
    this._config = config;
  }

  reloadGame(context: unknown): void {
    const gameData = GameContextSchema.parse(context);
    this._context = new DefaultGameContext({
      events: this._events,
      config: this._config,
      context: gameData,
    });

    this._state = loadState(
      gameData.currentState,
      this._context,
      this._events,
      this.changeState.bind(this),
    );
    setTimeout(() => this._state.init(), 0);
  }

  beginGame(players: PlayerInfo[], mapModel: MapModel) {
    // Create the game context based on the player list and selected map model.
    this._context = new DefaultGameContext({
      config: this._config,
      events: this._events,
      players,
      mapModel,
    });

    // Set the initial state so that the players can place their first mines.
    this._state = new BuildFirstMinesState(
      this._context,
      this._events,
      this.changeState.bind(this),
      {
        playerIndex: 0,
        pass: BuildFirstMinesPass.First,
      },
    );

    // Finally, launch the game asynchronously.
    setTimeout(() => this._state.init(), 0);
  }

  get events(): Observer {
    return this._delayedEvents;
  }

  get currentState(): GameState {
    return this._state.currentState;
  }

  get context(): Readonly<GameContext> {
    if (!this._context) {
      throw new GPError(
        ErrorCode.GameNotStarted,
        'The game context is not available until the game has started.',
      );
    }

    return this._context;
  }

  init(): void {
    /* TODO: Anything here? Constructor handles most things */
  }

  buildMine(location: MapHex): void {
    this._state.buildMine(location);
  }

  startGaiaProject(location: MapHex): void {
    this._state.startGaiaProject(location);
  }

  upgradeStructure(): void {
    this._state.upgradeStructure();
  }

  formFederation(): void {
    this._state.formFederation();
  }

  advanceResearch(area: ResearchArea): void {
    this._state.advanceResearch(area);
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

  pass(roundBooster: RoundBooster): void {
    this._state.pass(roundBooster);
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
      map: Object.values(this.context.map).map((hex) => {
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
          level1: player.powerCycle.level1,
          level2: player.powerCycle.level2,
          level3: player.powerCycle.level3,
        },
        research: player.research,
        resources: player.resources,
        roundBooster: player.roundBooster,
        vp: player.vp,
      })),
      roundBoosters: [...this.context.roundBoosters],
      roundScoringBonuses: [...this.context.roundScoringBonuses],
      passOrder: this.context.passOrder.map((p) => playerIndexes[p.id]),
    };
  }

  private changeState(newState: State) {
    this._state = newState;
    setTimeout(() => this._state.init(), 0);
  }

  toJSON(): SerializedState {
    return this._state.toJSON();
  }
}
