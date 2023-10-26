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
    /* TODO: Request players to choose their round booster. */
    this.events.publish({
      type: EventType.AwaitingPlayerInput,
      gameState: GameState.ChooseFirstRoundBoosters,
      allowedActions: [GameAction.Pass],
      player: this.player,
    });
  }

  chooseRoundBoosterAndPass(roundBooster: RoundBooster): void {}
}
