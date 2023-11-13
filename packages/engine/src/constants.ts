import {
  FactionType,
  PlanetType,
  ResearchArea,
  StructureType,
} from './interfaces';

export const ColonizingStructures: Set<StructureType> = new Set([
  StructureType.Academy,
  StructureType.Mine,
  StructureType.PlanetaryInstitute,
  StructureType.ResearchLab,
  StructureType.TradingStation,
]);

export const FactionTypeNames: Record<FactionType, string> = {
  [FactionType.Ambas]: 'Ambas',
  [FactionType.BalTaks]: "Bal T'Aks",
  [FactionType.Bescods]: 'Bescods',
  [FactionType.Firaks]: 'Firaks',
  [FactionType.Geodens]: 'Geodens',
  [FactionType.Gleens]: 'Gleens',
  [FactionType.HadschHallas]: 'Hadsch Hallas',
  [FactionType.Itars]: 'Itars',
  [FactionType.Ivits]: 'Ivits',
  [FactionType.Lantids]: 'Lantids',
  [FactionType.Nevlas]: 'Nevlas',
  [FactionType.Taklons]: 'Taklons',
  [FactionType.Terrans]: 'Terrans',
  [FactionType.Xenos]: 'Xenos',
} as const;

export const PlanetTypeNames: Record<PlanetType, string> = {
  [PlanetType.Desert]: 'Desert',
  [PlanetType.Gaia]: 'Gaia',
  [PlanetType.Ice]: 'Ice',
  [PlanetType.Oxide]: 'Oxide',
  [PlanetType.Swamp]: 'Swamp',
  [PlanetType.Terra]: 'Earth-like',
  [PlanetType.Titanium]: 'Titanium',
  [PlanetType.Transdim]: 'Transdim',
  [PlanetType.Volcanic]: 'Volcanic',
} as const;

export const ResearchAreaNames: Record<ResearchArea, string> = {
  [ResearchArea.AI]: 'Artificial Intelligence',
  [ResearchArea.Economics]: 'Economy',
  [ResearchArea.Gaia]: 'Gaia Project',
  [ResearchArea.Navigation]: 'Navigation',
  [ResearchArea.Science]: 'Science',
  [ResearchArea.Terraforming]: 'Terraforming',
} as const;

export const StructureTypeNamesPlural: Record<StructureType, string> = {
  [StructureType.Academy]: 'Acadamies',
  [StructureType.Gaiaformer]: 'Gaiaformers',
  [StructureType.Mine]: 'Mines',
  [StructureType.PlanetaryInstitute]: 'Planetary institute', // There is no pluralization for this... players only get one.
  [StructureType.ResearchLab]: 'Research labs',
  [StructureType.TradingStation]: 'Trading stations',
};
