import {
  ChangeStateFunction,
  EventType,
  GameAction,
  GameContext,
  GameState,
  Observer,
  Player,
  RoundBooster,
} from '..';
import { GameCompletedState } from './game-completed-state';
import { StateBase } from './state-base';

export class ChooseFirstRoundBoostersState extends StateBase {
  constructor(
    context: GameContext,
    events: Observer,
    changeState: ChangeStateFunction,
    private readonly player: Player,
  ) {
    super(context, events, changeState);
  }

  get currentState(): GameState {
    return GameState.ChooseFirstRoundBoosters;
  }

  init(): void {
    console.log('State changed!');
    this.events.publish({
      type: EventType.AwaitingPlayerInput,
      gameState: GameState.ChooseFirstRoundBoosters,
      allowedActions: [GameAction.Pass],
      player: this.player,
    });
  }

  chooseRoundBoosterAndPass(roundBooster: RoundBooster): void {
    console.log('Round booster selected', roundBooster);
    this.events.publish({
      type: EventType.RoundBoosterSelected,
      player: this.player,
      roundBooster,
    });

    const index = this.context.players.findIndex(
      (player) => player.id === this.player.id,
    );
    if (index === -1) {
      // This should never happen.
      throw new Error(
        'Unexpected error. The current player could not be found in the game context.',
      );
    }

    if (index > 0) {
      this.changeState(
        new ChooseFirstRoundBoostersState(
          this.context,
          this.events,
          this.changeState,
          this.context.players[index - 1],
        ),
      );
    } else {
      this.changeState(
        new GameCompletedState(this.context, this.events, this.changeState),
      );
    }
  }
}
