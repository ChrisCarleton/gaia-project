import {
  AcadamyBonusType,
  Faction,
  FactionIncome,
  ResearchProgress,
  SpecialAction,
  StructureType,
} from '../interfaces';

export const DefaultAcadamyBonuses = {
  a: { type: AcadamyBonusType.Income, income: { knowledge: 2 } },
  b: { type: AcadamyBonusType.Action, action: SpecialAction.GenerateQIC },
} as const;

export const DefaultStartingResearch: ResearchProgress = {
  ai: 0,
  gaia: 0,
  navigation: 0,
  terraforming: 0,
  science: 0,
  economics: 0,
};

export const DefaultStructures: Record<StructureType, number> = {
  [StructureType.Academy]: 2,
  [StructureType.Gaiaformer]: 0,
  [StructureType.Mine]: 8,
  [StructureType.PlanetaryInstitute]: 1,
  [StructureType.ResearchLab]: 3,
  [StructureType.TradingStation]: 4,
};

export const DefaultStructureIncome: Readonly<FactionIncome> = {
  [StructureType.Mine]: [
    { ore: 1 },
    { ore: 2 },
    { ore: 3 },
    { ore: 3 },
    { ore: 4 },
    { ore: 5 },
    { ore: 6 },
    { ore: 7 },
    { ore: 8 },
  ],
  [StructureType.TradingStation]: [
    {},
    { credits: 3 },
    { credits: 7 },
    { credits: 11 },
    { credits: 16 },
  ],
  [StructureType.ResearchLab]: [
    { knowledge: 1 },
    { knowledge: 2 },
    { knowledge: 3 },
    { knowledge: 4 },
  ],
  [StructureType.PlanetaryInstitute]: [
    {},
    {
      chargePower: 4,
      powerNodes: 1,
    },
  ],
};

export const DefaultFactionConfig: Pick<
  Faction,
  'acadamyBonuses' | 'income' | 'startingResearch' | 'startingStructures'
> = {
  acadamyBonuses: { ...DefaultAcadamyBonuses },
  income: { ...DefaultStructureIncome },
  startingResearch: { ...DefaultStartingResearch },
  startingStructures: { ...DefaultStructures },
} as const;
