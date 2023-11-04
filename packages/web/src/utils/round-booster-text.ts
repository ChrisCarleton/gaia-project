import {
  FreeAction,
  Income,
  RoundBoosterBonus,
  RoundBoosterBonusType,
  RoundBoosterPassBonusDiscriminator,
} from '@gaia-project/engine';

const DiscriminatorStrings: Record<RoundBoosterPassBonusDiscriminator, string> =
  {
    [RoundBoosterPassBonusDiscriminator.GaiaPlanets]: 'colonized gaia planet',
    [RoundBoosterPassBonusDiscriminator.Mines]: 'mine',
    [RoundBoosterPassBonusDiscriminator.PlanetaryInstitutesAndAcadamies]:
      'academy or planetary institute',
    [RoundBoosterPassBonusDiscriminator.ResearchLabs]: 'research lab',
    [RoundBoosterPassBonusDiscriminator.TradingStations]: 'trading station',
  } as const;

function getActionString(action: FreeAction): string {
  switch (action) {
    case FreeAction.BuildMineOrStartGaiaWithRangeBoost:
      return `As a special
action, you may take a “Build a Mine” action with one
free terraforming step. You can pay ore for additional
terraforming steps, but you cannot combine this action with
another action.`;

    case FreeAction.BuildMineWithTerraforming:
      return `As a special
action, you can take a “Build a Mine” action or “Start a
Gaia Project” with your basic range increased by three. The
normal rules for the actions apply. This action cannot be
combined with another action.`;

    default:
      return '';
  }
}

function getIncomeString(income: Income): string {
  if (income.chargePower) return `charge ${income.chargePower} power tokens`;
  if (income.credits) return `gain ${income.credits} credits`;
  if (income.knowledge) return `gain ${income.knowledge} knowledge`;
  if (income.ore) return `gain ${income.ore} ore`;
  if (income.powerNodes) return `gain ${income.powerNodes} power tokens`;
  if (income.qic) return `gain ${income.qic} QIC`;

  return '';
}

export function getRoundBoosterText(bonus: RoundBoosterBonus): string {
  switch (bonus.type) {
    case RoundBoosterBonusType.Action:
      return getActionString(bonus.action);

    case RoundBoosterBonusType.BonusOnPass:
      return `When you pass this round, gain ${bonus.vp}VP for every ${
        DiscriminatorStrings[bonus.discriminator]
      } you have on the map.`;

    case RoundBoosterBonusType.Income:
      return `As income, ${getIncomeString(bonus.income)} this round.`;

    default:
      return '';
  }
}
