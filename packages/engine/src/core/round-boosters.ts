import {
  RoundBooster,
  RoundBoosterBonusType,
  RoundBoosterPassBonusDiscriminator,
  SpecialAction,
} from '../interfaces';

export const RoundBoosters: Readonly<RoundBooster[]> = [
  {
    id: 0,
    a: {
      type: RoundBoosterBonusType.Income,
      income: {
        ore: 1,
      },
    },
    b: {
      type: RoundBoosterBonusType.Income,
      income: {
        knowledge: 1,
      },
    },
  },

  {
    id: 1,
    a: {
      type: RoundBoosterBonusType.Income,
      income: {
        credits: 2,
      },
    },
    b: {
      type: RoundBoosterBonusType.Income,
      income: {
        qic: 1,
      },
    },
  },

  {
    id: 2,
    a: {
      type: RoundBoosterBonusType.Income,
      income: {
        powerNodes: 2,
      },
    },
    b: {
      type: RoundBoosterBonusType.Income,
      income: {
        ore: 1,
      },
    },
  },

  {
    id: 3,
    a: {
      type: RoundBoosterBonusType.Income,
      income: {
        credits: 2,
      },
    },
    b: {
      type: RoundBoosterBonusType.Action,
      action: SpecialAction.BuildMineWithTerraforming,
    },
  },

  {
    id: 4,
    a: {
      type: RoundBoosterBonusType.Income,
      income: {
        chargePower: 2,
      },
    },
    b: {
      type: RoundBoosterBonusType.Action,
      action: SpecialAction.BuildMineOrStartGaiaWithRangeBoost,
    },
  },

  {
    id: 5,
    a: {
      type: RoundBoosterBonusType.Income,
      income: {
        ore: 1,
      },
    },
    b: {
      type: RoundBoosterBonusType.BonusOnPass,
      discriminator: RoundBoosterPassBonusDiscriminator.Mines,
      vp: 1,
    },
  },

  {
    id: 6,
    a: {
      type: RoundBoosterBonusType.Income,
      income: {
        knowledge: 1,
      },
    },
    b: {
      type: RoundBoosterBonusType.BonusOnPass,
      discriminator: RoundBoosterPassBonusDiscriminator.ResearchLabs,
      vp: 3,
    },
  },

  {
    id: 7,
    a: {
      type: RoundBoosterBonusType.Income,
      income: {
        ore: 1,
      },
    },
    b: {
      type: RoundBoosterBonusType.BonusOnPass,
      discriminator: RoundBoosterPassBonusDiscriminator.TradingStations,
      vp: 2,
    },
  },

  {
    id: 8,
    a: {
      type: RoundBoosterBonusType.Income,
      income: {
        chargePower: 4,
      },
    },
    b: {
      type: RoundBoosterBonusType.BonusOnPass,
      discriminator:
        RoundBoosterPassBonusDiscriminator.PlanetaryInstitutesAndAcadamies,
      vp: 4,
    },
  },

  {
    id: 9,
    a: {
      type: RoundBoosterBonusType.Income,
      income: {
        credits: 4,
      },
    },
    b: {
      type: RoundBoosterBonusType.BonusOnPass,
      discriminator: RoundBoosterPassBonusDiscriminator.GaiaPlanets,
      vp: 1,
    },
  },
];
