import {
  ChangeStateFunction,
  EventType,
  GameAction,
  GameContext,
  GameState,
  ObserverPublisher,
  RoundBooster,
} from '..';
import { SerializedState } from '../core/serialization';
import { IncomePhaseState } from './income-phase-state';
import { StateBase } from './state-base';

export class ChooseFirstRoundBoostersState extends StateBase {
  constructor(
    context: GameContext,
    events: ObserverPublisher,
    changeState: ChangeStateFunction,
    private readonly player: number,
  ) {
    super(context, events, changeState);
  }

  get currentState(): GameState {
    return GameState.ChooseFirstRoundBoosters;
  }

  init(): void {
    this.events.publish({
      type: EventType.AwaitingPlayerInput,
      gameState: GameState.ChooseFirstRoundBoosters,
      allowedActions: [GameAction.SelectRoundBooster],
      player: this.context.players[this.player],
    });
  }

  chooseRoundBoosterAndPass(roundBooster: RoundBooster): void {
    const player = this.context.players[this.player];

    const index = this.context.roundBoosters.findIndex(
      (rb) => rb.id === roundBooster.id,
    );
    if (index === -1) {
      throw new Error('Unknown round booster.');
    }

    this.context.roundBoosters.splice(index, 1);
    this.events.publish({
      type: EventType.RoundBoosterSelected,
      player,
      roundBooster,
    });

    if (this.player === 0) {
      // All done. Advance the game to the next phase.
      this.changeState(
        new IncomePhaseState(this.context, this.events, this.changeState),
      );
    } else {
      this.changeState(
        new ChooseFirstRoundBoostersState(
          this.context,
          this.events,
          this.changeState,
          this.player - 1,
        ),
      );
    }
  }

  toJSON(): SerializedState {
    return {
      type: GameState.ChooseFirstRoundBoosters,
      player: this.player,
    };
  }
}
