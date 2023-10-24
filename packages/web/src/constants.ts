import { FactionType, PlanetType } from '@gaia-project/engine';

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
