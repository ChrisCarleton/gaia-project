import { SerializedState } from '../core/serialization';
import { ErrorCode, GPError } from '../errors';
import { EventType } from '../events/event-args';
import { ObserverPublisher } from '../events/observer';
import {
  ChangeStateFunction,
  GameAction,
  GameContext,
  GameState,
  MapHex,
  StructureType,
} from '../interfaces';
import {
  BuildFirstMinesOptions,
  BuildFirstMinesTurnOrder,
} from './build-first-mines-turn-order';
import { ChooseFirstRoundBoostersState } from './choose-first-round-boosters-state';
import { StateBase } from './state-base';

/*
  TODO: The turn oder logic is, by far, the most complicated piece of this. Consider factoring it out into its own file/class.
*/
export class BuildFirstMinesState extends StateBase {
  constructor(
    context: GameContext,
    events: ObserverPublisher,
    changeState: ChangeStateFunction,
    private readonly options: BuildFirstMinesOptions,
  ) {
    super(context, events, changeState);
  }

  get currentState(): GameState {
    return GameState.BuildFirstMines;
  }

  init(): void {
    // Alert the current player that they need to place a fresh mine.
    this.events.publish({
      type: EventType.AwaitingPlayerInput,
      player: this.context.players[this.options.playerIndex],
      gameState: this.currentState,
      allowedActions: [GameAction.BuildMine],
      gameContext: this.context,
    });
  }

  buildMine(location: MapHex): void {
    // Identify the player
    const player = this.context.players[this.options.playerIndex];

    // Validate hex. Must be unoccupied and contain a planet matching the player's home world.
    if (!location.planet) {
      throw new GPError(
        ErrorCode.InvalidMinePlacement,
        'New mine must be built on a planet.',
      );
    }

    if (location.planet.type !== player.faction.homeWorld) {
      throw new GPError(
        ErrorCode.InvalidMinePlacement,
        "Mine can only be built on the player's homeworld type.",
      );
    }

    if (location.planet.structure) {
      throw new GPError(
        ErrorCode.InvalidMinePlacement,
        'Mine can only be placed on an unoccupied planet.',
      );
    }

    location.planet.player = player;
    location.planet.structure = StructureType.Mine;

    // Place mine event.
    this.events.publish({
      type: EventType.MineBuilt,
      player,
      location,
    });

    const nextState = BuildFirstMinesTurnOrder.determineNextState(
      this.options.pass,
      this.context.players,
      this.options.playerIndex,
    );

    if (nextState) {
      this.changeState(
        new BuildFirstMinesState(
          this.context,
          this.events,
          this.changeState,
          nextState,
        ),
      );
    } else {
      this.changeState(
        new ChooseFirstRoundBoostersState(
          this.context,
          this.events,
          this.changeState,
          this.context.players.length - 1,
        ),
      );
    }
  }

  toJSON(): SerializedState {
    return {
      type: GameState.BuildFirstMines,
      player: this.options.playerIndex,
      pass: this.options.pass,
    };
  }
}
