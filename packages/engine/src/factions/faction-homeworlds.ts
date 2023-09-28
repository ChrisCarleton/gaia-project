import { FactionType } from '@gaia-project/api';

import { PlanetType } from '..';

export const FactionHomeWorlds: Record<FactionType, PlanetType> = {
  [FactionType.Ambas]: PlanetType.Swamp,
  [FactionType.BalTaks]: PlanetType.Volcanic,
  [FactionType.Bescods]: PlanetType.Titanium,
  [FactionType.Firaks]: PlanetType.Titanium,
  [FactionType.Geodens]: PlanetType.Volcanic,
  [FactionType.Gleens]: PlanetType.Desert,
  [FactionType.HadschHallas]: PlanetType.Oxide,
  [FactionType.Itars]: PlanetType.Ice,
  [FactionType.Ivits]: PlanetType.Oxide,
  [FactionType.Lantids]: PlanetType.Terra,
  [FactionType.Taklons]: PlanetType.Swamp,
  [FactionType.Nevlas]: PlanetType.Ice,
  [FactionType.Terrans]: PlanetType.Terra,
  [FactionType.Xenos]: PlanetType.Desert,
} as const;
