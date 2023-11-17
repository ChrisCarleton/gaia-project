import { ObserverPublisher } from '../../events';
import {
  ChangeStateFunction,
  GameContext,
  GameState,
  State,
} from '../../interfaces';
import { loadState } from '../load-state';

export class NextStateDetermination {
  static determineNextState(
    context: GameContext,
    events: ObserverPublisher,
    changeState: ChangeStateFunction,
  ): State {
    const { currentRound, currentPlayer: player, players } = context;

    // Find the current player in turn order.
    let index = players.findIndex((p) => Object.is(p, player));
    if (index === -1) {
      throw new Error(
        'Unexpected error. Could not find player in game context.',
      );
    }

    // Find the next player in turn order that has not already passed.
    do {
      index = (index + 1) % players.length;
      if (!players[index].passed) {
        return loadState(
          {
            type: GameState.ActionPhase,
            player: index,
          },
          context,
          events,
          changeState,
        );
      }
    } while (!Object.is(player, players[index]));

    // If everyone has passed then we can clean up for the next round, or end the game if
    // we are on the final round.
    return currentRound < 6
      ? loadState({ type: GameState.IncomePhase }, context, events, changeState)
      : loadState({ type: GameState.GameEnded }, context, events, changeState);
  }
}
