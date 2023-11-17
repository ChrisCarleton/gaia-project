import {
  AcadamyBonusType,
  Faction,
  FactionType,
  SpecialAction,
  StructureType,
} from '../interfaces';
import {
  DefaultFactionConfig,
  DefaultStartingResearch,
  DefaultStructureIncome,
  DefaultStructures,
} from './faction-defaults';
import { FactionHomeWorlds } from './faction-homeworlds';

export * from './faction-homeworlds';

export const Factions: Record<FactionType, Faction> = {
  [FactionType.Ambas]: {
    ...DefaultFactionConfig,
    factionType: FactionType.Ambas,
    homeWorld: FactionHomeWorlds[FactionType.Ambas],
    income: {
      ...DefaultStructureIncome,
      mine: [
        { ore: 2 },
        { ore: 3 },
        { ore: 4 },
        { ore: 4 },
        { ore: 5 },
        { ore: 6 },
        { ore: 7 },
        { ore: 8 },
        { ore: 9 },
      ],
      planetaryInstitute: [
        {},
        {
          powerCharge: 4,
          powerNodes: 2,
        },
      ],
    },
    startingPowerCycle: {
      level1: 2,
      level2: 4,
      level3: 0,
      gaia: 0,
    },
    startingResearch: {
      ...DefaultStartingResearch,
      navigation: 1,
    },
    startingResources: {
      credits: 15,
      ore: 4,
      knowledge: 3,
      qic: 2,
    },
  },

  [FactionType.BalTaks]: {
    ...DefaultFactionConfig,
    acadamyBonuses: {
      a: { type: AcadamyBonusType.Income, income: { knowledge: 2 } },
      b: {
        type: AcadamyBonusType.Action,
        action: SpecialAction.Receive4Credits,
      },
    },
    factionType: FactionType.BalTaks,
    homeWorld: FactionHomeWorlds[FactionType.BalTaks],
    startingPowerCycle: {
      level1: 4,
      level2: 4,
      level3: 0,
      gaia: 0,
    },
    startingResearch: {
      ...DefaultStartingResearch,
      gaia: 1,
    },
    startingResources: {
      credits: 15,
      ore: 4,
      knowledge: 3,
      qic: 1,
    },
    startingStructures: {
      ...DefaultStructures,
      gaiaformer: 1,
    },
  },

  [FactionType.Bescods]: {
    ...DefaultFactionConfig,
    factionType: FactionType.Bescods,
    homeWorld: FactionHomeWorlds[FactionType.Bescods],
    startingPowerCycle: {
      level1: 2,
      level2: 4,
      level3: 0,
      gaia: 0,
    },
    startingResources: {
      credits: 15,
      knowledge: 1,
      ore: 4,
      qic: 1,
    },
    income: {
      ...DefaultStructureIncome,
      tradingStation: [
        {},
        { knowledge: 1 },
        { knowledge: 2 },
        { knowledge: 3 },
        { knowledge: 4 },
      ],
      researchLab: [{}, { credits: 3 }, { credits: 7 }, { credits: 12 }],
      planetaryInstitute: [{}, { powerCharge: 4, powerNodes: 2 }],
    },
  },

  [FactionType.Firaks]: {
    ...DefaultFactionConfig,
    factionType: FactionType.Firaks,
    homeWorld: FactionHomeWorlds[FactionType.Firaks],
    startingPowerCycle: {
      level1: 2,
      level2: 4,
      level3: 0,
      gaia: 0,
    },
    startingResources: {
      credits: 15,
      knowledge: 2,
      ore: 3,
      qic: 1,
    },
    income: {
      ...DefaultStructureIncome,
      [StructureType.ResearchLab]: [
        { knowledge: 2 },
        { knowledge: 3 },
        { knowledge: 4 },
        { knowledge: 5 },
      ],
    },
  },

  [FactionType.Geodens]: {
    ...DefaultFactionConfig,
    factionType: FactionType.Geodens,
    homeWorld: FactionHomeWorlds[FactionType.Geodens],
    startingPowerCycle: {
      level1: 2,
      level2: 4,
      level3: 0,
      gaia: 0,
    },
    startingResources: {
      credits: 15,
      knowledge: 3,
      ore: 6,
      qic: 1,
    },
    startingResearch: {
      ...DefaultStartingResearch,
      terraforming: 1,
    },
  },

  [FactionType.Gleens]: {
    ...DefaultFactionConfig,
    factionType: FactionType.Gleens,
    homeWorld: FactionHomeWorlds[FactionType.Gleens],
    income: {
      ...DefaultStructureIncome,
      planetaryInstitute: [
        {},
        {
          powerCharge: 4,
          ore: 1,
        },
      ],
    },
    startingPowerCycle: {
      level1: 2,
      level2: 4,
      level3: 0,
      gaia: 0,
    },
    startingResources: {
      credits: 15,
      knowledge: 3,
      ore: 5,
      qic: 0,
    },
    startingResearch: {
      ...DefaultStartingResearch,
      navigation: 1,
    },
  },

  [FactionType.HadschHallas]: {
    ...DefaultFactionConfig,
    factionType: FactionType.HadschHallas,
    homeWorld: FactionHomeWorlds[FactionType.HadschHallas],
    startingPowerCycle: {
      level1: 2,
      level2: 4,
      level3: 0,
      gaia: 0,
    },
    startingResources: {
      credits: 15,
      knowledge: 3,
      ore: 4,
      qic: 1,
    },
    income: {
      ...DefaultStructureIncome,
      [StructureType.TradingStation]: [
        { credits: 3 },
        { credits: 6 },
        { credits: 10 },
        { credits: 14 },
        { credits: 19 },
      ],
    },
    startingResearch: {
      ...DefaultStartingResearch,
      economics: 1,
    },
  },

  [FactionType.Itars]: {
    ...DefaultFactionConfig,
    factionType: FactionType.Itars,
    homeWorld: FactionHomeWorlds[FactionType.Itars],
    acadamyBonuses: {
      a: { type: AcadamyBonusType.Income, income: { knowledge: 3 } },
      b: { type: AcadamyBonusType.Action, action: SpecialAction.GenerateQIC },
    },
    startingPowerCycle: {
      level1: 4,
      level2: 4,
      level3: 0,
      gaia: 0,
    },
    startingResources: {
      credits: 15,
      knowledge: 3,
      ore: 5,
      qic: 1,
    },
    income: {
      ...DefaultStructureIncome,
      planetaryInstitute: [
        { powerNodes: 1 },
        { powerCharge: 4, powerNodes: 2 },
      ],
    },
  },

  [FactionType.Ivits]: {
    ...DefaultFactionConfig,
    factionType: FactionType.Ivits,
    homeWorld: FactionHomeWorlds[FactionType.Ivits],
    startingPowerCycle: {
      level1: 2,
      level2: 4,
      level3: 0,
      gaia: 0,
    },
    startingResources: {
      credits: 15,
      knowledge: 3,
      ore: 4,
      qic: 1,
    },
    income: {
      ...DefaultStructureIncome,
      planetaryInstitute: [
        { qic: 1 },
        { qic: 1, powerCharge: 4, powerNodes: 1 },
      ],
    },
  },

  [FactionType.Lantids]: {
    ...DefaultFactionConfig,
    factionType: FactionType.Lantids,
    homeWorld: FactionHomeWorlds[FactionType.Lantids],
    startingPowerCycle: {
      level1: 4,
      level2: 0,
      level3: 0,
      gaia: 0,
    },
    startingResources: {
      credits: 13,
      knowledge: 3,
      ore: 4,
      qic: 1,
    },
    income: {
      ...DefaultStructureIncome,
      planetaryInstitute: [{}, { powerCharge: 4 }],
    },
  },

  [FactionType.Nevlas]: {
    ...DefaultFactionConfig,
    factionType: FactionType.Nevlas,
    homeWorld: FactionHomeWorlds[FactionType.Nevlas],
    startingPowerCycle: {
      level1: 2,
      level2: 4,
      level3: 0,
      gaia: 0,
    },
    startingResources: {
      credits: 15,
      knowledge: 2,
      ore: 4,
      qic: 1,
    },
    income: {
      ...DefaultStructureIncome,
      researchLab: [
        { knowledge: 1 },
        { knowledge: 1, powerCharge: 2 },
        { knowledge: 1, powerCharge: 4 },
        { knowledge: 1, powerCharge: 6 },
      ],
    },
    startingResearch: {
      ...DefaultStartingResearch,
      science: 1,
    },
  },

  [FactionType.Taklons]: {
    ...DefaultFactionConfig,
    factionType: FactionType.Taklons,
    homeWorld: FactionHomeWorlds[FactionType.Taklons],
    startingPowerCycle: {
      level1: 2,
      level2: 4,
      level3: 0,
      gaia: 0,
      brainStonePosition: 1,
    },
    startingResources: {
      credits: 15,
      knowledge: 3,
      ore: 4,
      qic: 1,
    },
  },

  [FactionType.Terrans]: {
    ...DefaultFactionConfig,
    factionType: FactionType.Terrans,
    homeWorld: FactionHomeWorlds[FactionType.Terrans],
    startingPowerCycle: {
      level1: 4,
      level2: 4,
      level3: 0,
      gaia: 0,
    },
    startingResearch: {
      ...DefaultStartingResearch,
      gaia: 1,
    },
    startingResources: {
      credits: 15,
      ore: 4,
      knowledge: 3,
      qic: 1,
    },
    startingStructures: {
      ...DefaultStructures,
      gaiaformer: 1,
    },
  },

  [FactionType.Xenos]: {
    ...DefaultFactionConfig,
    factionType: FactionType.Xenos,
    homeWorld: FactionHomeWorlds[FactionType.Xenos],
    startingPowerCycle: {
      level1: 2,
      level2: 4,
      level3: 0,
      gaia: 0,
    },
    startingResources: {
      credits: 15,
      knowledge: 3,
      ore: 4,
      qic: 2,
    },
    income: {
      ...DefaultStructureIncome,
      planetaryInstitute: [{}, { powerCharge: 4, qic: 1 }],
    },
    startingResearch: {
      ...DefaultStartingResearch,
      ai: 1,
    },
  },
} as const;
