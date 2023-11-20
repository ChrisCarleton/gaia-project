import { SerializedState } from '../core/serialization';
import { EventType, ObserverPublisher } from '../events';
import {
  ChangeStateFunction,
  FreeAction,
  GameAction,
  GameContext,
  GameState,
  Player,
} from '../interfaces';
import { NextStateDetermination } from './action-phase';
import { FreeActions } from './action-phase/free-actions';
import { StateBase } from './state-base';

export class FreeActionPhaseState extends StateBase {
  constructor(
    context: GameContext,
    events: ObserverPublisher,
    changeState: ChangeStateFunction,
    readonly player: Player,
  ) {
    super(context, events, changeState);
  }

  get currentState(): GameState {
    return GameState.FreeActionPhase;
  }

  init(): void {
    this.events.publish({
      type: EventType.AwaitingPlayerInput,
      allowedActions: [GameAction.Free, GameAction.Pass],
      gameContext: this.context,
      gameState: this.currentState,
      player: this.player,
    });
  }

  freeAction(action: FreeAction): void {
    FreeActions.performFreeAction(this.player, this.events, action);
  }

  pass(): void {
    // Player has already performed an action, so this just means they are yielding their turn to the next player.
    // They will be allowed to take further turns before the round ends.
    const nextState = NextStateDetermination.determineNextState(
      this.context,
      this.events,
      this.changeState,
    );
    this.changeState(nextState);
  }

  toJSON(): SerializedState {
    return {
      type: GameState.FreeActionPhase,
      player: this.context.players.findIndex((p) => p.id === this.player.id),
    };
  }
}
