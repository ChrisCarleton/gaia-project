import {
  ChangeStateFunction,
  EventType,
  GameAction,
  GameContext,
  GameState,
  Observer,
  RoundBooster,
} from '..';
import { SerializedState } from '../core/serialization';
import { GameCompletedState } from './game-completed-state';
import { StateBase } from './state-base';

export class ChooseFirstRoundBoostersState extends StateBase {
  constructor(
    context: GameContext,
    events: Observer,
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
      allowedActions: [GameAction.Pass],
      player: this.context.players[this.player],
    });
  }

  chooseRoundBoosterAndPass(roundBooster: RoundBooster): void {
    const player = this.context.players[this.player];

    const index = this.context.roundBoosters.findIndex(
      (rb) => rb.id === roundBooster.id,
    );
    if (index === -1) {
      // TODO: Throw error
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
        new GameCompletedState(this.context, this.events, this.changeState),
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
