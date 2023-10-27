import { SerializedState } from '../core/serialization';
import { EventType, Observer } from '../events';
import { ChangeStateFunction, GameContext, GameState } from '../interfaces';
import { StateBase } from './state-base';

export class GameCompletedState extends StateBase {
  constructor(
    context: GameContext,
    events: Observer,
    changeState: ChangeStateFunction,
  ) {
    super(context, events, changeState);
  }

  get currentState(): GameState {
    return GameState.GameEnded;
  }

  init(): void {
    // It's game over, man! Game over!!!

    // TODO: 1. Award VP for final scoring tiles.
    // TODO: 2. Award VP for research progress.

    // 3. Award VP for remaining resources.
    for (const player of this.context.players) {
      const { credits, knowledge, ore } = player.resources;
      const resourceBonus =
        Math.floor(credits / 3) +
        Math.floor(knowledge / 3) +
        Math.floor(ore / 3);
      this.events.publish({
        type: EventType.VPAwarded,
        player,
        vp: resourceBonus,
        message: 'Remaining resources',
      });
    }

    // 4. Sort players in descending order by VP. Boom! The winner is the first player in the array.
    const playerRanking = [...this.context.players].sort((a, b) => b.vp - a.vp);

    this.events.publish({
      type: EventType.GameEnded,
      playerRanking,
    });
  }

  toJSON(): SerializedState {
    return {
      type: GameState.GameEnded,
    };
  }
}
