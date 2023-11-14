import { ColonizingStructures } from '../../constants';
import { ErrorCode, GPError } from '../../errors';
import { EventType, ObserverPublisher } from '../../events';
import {
  GameContext,
  PlanetType,
  Player,
  RoundBooster,
  RoundBoosterBonus,
  RoundBoosterBonusType,
  RoundBoosterPassBonusDiscriminator,
} from '../../interfaces';
import { axialToString } from '../../utils';

type PassBonusStrategy = (
  vp: number,
  player: Player,
  context: GameContext,
) => number;

export class PassAction {
  private static PassBonusStrategies: Record<
    RoundBoosterPassBonusDiscriminator,
    PassBonusStrategy
  > = {
    [RoundBoosterPassBonusDiscriminator.GaiaPlanets]: (vp, player, context) => {
      let vpBonus = 0;
      for (const structure of ColonizingStructures) {
        for (const location of player.structures[structure].locations) {
          if (
            context.map[axialToString(location)].planet?.type ===
            PlanetType.Gaia
          ) {
            vpBonus += vp;
          }
        }
      }
      return vpBonus;
    },
    [RoundBoosterPassBonusDiscriminator.Mines]: (vp, player) =>
      vp * player.structures.mine.active,
    [RoundBoosterPassBonusDiscriminator.PlanetaryInstitutesAndAcadamies]: (
      vp,
      player,
    ) =>
      vp *
      (player.structures.academy.active +
        player.structures.planetaryInstitute.active),
    [RoundBoosterPassBonusDiscriminator.ResearchLabs]: (vp, player) =>
      vp * player.structures.researchLab.active,
    [RoundBoosterPassBonusDiscriminator.TradingStations]: (vp, player) =>
      vp * player.structures.tradingStation.active,
  };

  private resolvePassBonus(
    bonus: RoundBoosterBonus,
    player: Player,
    context: GameContext,
  ): number {
    if (bonus.type === RoundBoosterBonusType.BonusOnPass) {
      return PassAction.PassBonusStrategies[bonus.discriminator](
        bonus.vp,
        player,
        context,
      );
    }

    return 0;
  }

  pass(
    context: GameContext,
    player: Player,
    events: ObserverPublisher,
    roundBooster?: RoundBooster,
  ): void {
    // 1. Validate the user's choice of round booster.
    if (context.currentRound < 6) {
      // a. User's MUST select a new round booster for rounds 1-5. It's not required in round 6 and will be ignored.
      if (!roundBooster) {
        throw new GPError(
          ErrorCode.RoundBoosterNotSelected,
          'For rounds 1-5, players must select a round booster when passing. (Selecting a round booster has no effect on round 6, so it is optional.',
        );
      }

      // b. Selected round booster must be available in the supply.
      const boosterIndex = context.roundBoosters.findIndex((rb) =>
        Object.is(roundBooster, rb),
      );

      if (boosterIndex === -1) {
        throw new GPError(
          ErrorCode.InvalidRoundBooster,
          'Selected roundbooster is unavailable',
        );
      }
    }

    // 2. Some round boosters have effects that are triggered when players pass. Resolve those effects.
    if (player.roundBooster) {
      const vp =
        this.resolvePassBonus(player.roundBooster.a, player, context) +
        this.resolvePassBonus(player.roundBooster.b, player, context);

      if (vp > 0) {
        events.publish({
          type: EventType.VPAwarded,
          vp,
          player,
          message: 'Round booster bonus',
        });
      }
    }

    /*
      2. Player must return round booster to the supply.
      3. Player selects a new round booster to take in the following round.
        a. Exception: In the final round of the game, the player does not need to select another round booster.
    */
    if (context.currentRound < 6) {
      events.publish({
        type: EventType.RoundBoosterSelected,
        player,
        roundBooster: roundBooster!,
        previousRoundBooster: player.roundBooster,
      });
    }
  }
}
