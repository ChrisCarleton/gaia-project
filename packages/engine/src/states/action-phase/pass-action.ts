import { ObserverPublisher } from '../../events';
import { GameContext, Player, RoundBooster } from '../../interfaces';

export class PassAction {
  pass(
    context: GameContext,
    player: Player,
    events: ObserverPublisher,
    roundBooster: RoundBooster,
  ): void {
    /*
      1. Some round boosters have effects that are triggered when players pass. Resolve those effects.
      2. Player must return round booster to the supply.
      3. Player selects a new round booster to take in the following round.
        a. Exception: In the final round of the game, the player does not need to select another round booster.
      4. Player is added to the "passed" array.
      5. Game progresses to the next state.
        a. The next player in turn order who has NOT passed takes an action.
        b. If ALL players have now passed, progress to round clean-up.
    */
  }
}
