import { SerializedState } from '../core/serialization';
import { ObserverPublisher } from '../events';
import { ChangeStateFunction, GameContext, GameState } from '../interfaces';
import { ActionPhaseState } from './action-phase-state';
import { StateBase } from './state-base';

export class GaiaPhaseState extends StateBase {
  constructor(
    context: GameContext,
    events: ObserverPublisher,
    changeState: ChangeStateFunction,
  ) {
    super(context, events, changeState);
  }

  get currentState(): GameState {
    return GameState.GaiaPhase;
  }

  init(): void {
    // TODO: Convert Transdim planets to Gaia planets and restore power tokens to the power cycle.

    this.changeState(
      new ActionPhaseState(
        this.context,
        this.events,
        this.changeState,
        this.context.players[0],
      ),
    );
  }

  toJSON(): SerializedState {
    return { type: GameState.GaiaPhase };
  }
}
