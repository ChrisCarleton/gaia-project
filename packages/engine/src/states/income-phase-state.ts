import { ChangeStateFunction, GameContext, GameState, Observer } from '..';
import { nextTick } from '../utils';
import { StateBase } from './state-base';

export class IncomePhaseState extends StateBase {
  constructor(
    context: GameContext,
    events: Observer,
    changeState: ChangeStateFunction,
  ) {
    super(context, events, changeState);
  }

  get currentState(): GameState {
    return GameState.IncomePhase;
  }

  init(): void {
    nextTick(this.doIncome);
  }

  private doIncome(): void {
    // TODO: Perform income calculations for the current round.
  }
}
