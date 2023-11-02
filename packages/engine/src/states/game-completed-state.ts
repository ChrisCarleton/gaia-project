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
    const calculateResearchBonus = (level: number): number =>
      4 * (level < 3 ? 0 : level - 2);

    /*
      TODO: Award VP for final scoring tiles. For each final scoring track.
        0. Remember! A "neutral" player is present for one- or two-player games. The neutral player's rank is fixed to the final scoring tiles.
        1. First place player gets 18VP, second place gets 12VP, and third gets 6VP.
        2. If there is a tie at any level.
          a. Players combine that level + next level and divide the points evenly.
              E.g. Two players tie for second. The prize for second is 12VP and the prize for third is 6VP, so they each receive (12 + 6) / 2 = 9VP.
    */

    for (const player of this.context.players) {
      // 2. Award VP for research progress.
      const researchBonus =
        calculateResearchBonus(player.research.ai) +
        calculateResearchBonus(player.research.economics) +
        calculateResearchBonus(player.research.gaia) +
        calculateResearchBonus(player.research.navigation) +
        calculateResearchBonus(player.research.science) +
        calculateResearchBonus(player.research.terraforming);

      if (researchBonus > 0) {
        this.events.publish({
          type: EventType.VPAwarded,
          player,
          vp: researchBonus,
          message: 'Research progress',
        });
      }

      // 3. Award VP for remaining resources.
      const { credits, knowledge, ore } = player.resources;
      const resourceBonus =
        Math.floor(credits / 3) +
        Math.floor(knowledge / 3) +
        Math.floor(ore / 3);

      if (resourceBonus > 0) {
        this.events.publish({
          type: EventType.VPAwarded,
          player,
          vp: resourceBonus,
          message: 'Remaining resources',
        });
      }
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
