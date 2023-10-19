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
  [PlanetType.Desert]: 'Desert World',
  [PlanetType.Gaia]: 'Gaia Planet',
  [PlanetType.Ice]: 'Ice World',
  [PlanetType.Oxide]: 'Oxide World',
  [PlanetType.Swamp]: 'Swamp World',
  [PlanetType.Terra]: 'Earth-like World',
  [PlanetType.Titanium]: 'Titanium World',
  [PlanetType.Transdim]: 'Transdim Planet',
  [PlanetType.Volcanic]: 'Volcanic World',
} as const;
