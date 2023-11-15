import { Faction, FactionType } from '../interfaces';
import {
  DefaultFactionConfig,
  DefaultStartingResearch,
  DefaultStructures,
} from './faction-defaults';
import { FactionHomeWorlds } from './faction-homeworlds';

export * from './faction-homeworlds';

export const Factions: Partial<Record<FactionType, Faction>> = {
  [FactionType.Ambas]: {
    ...DefaultFactionConfig,
    factionType: FactionType.Ambas,
    homeWorld: FactionHomeWorlds[FactionType.Ambas],
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
      qic: 1,
    },
  },

  [FactionType.BalTaks]: {
    ...DefaultFactionConfig,
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
} as const;
