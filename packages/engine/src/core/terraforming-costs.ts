import { PlanetType } from '..';

export const TerraformingCosts = {
  [PlanetType.Desert]: {
    [PlanetType.Desert]: 0,
    [PlanetType.Ice]: 3,
    [PlanetType.Oxide]: 2,
    [PlanetType.Swamp]: 1,
    [PlanetType.Terra]: 3,
    [PlanetType.Titanium]: 2,
    [PlanetType.Volcanic]: 1,
  },
  [PlanetType.Ice]: {
    [PlanetType.Desert]: 3,
    [PlanetType.Ice]: 0,
    [PlanetType.Oxide]: 2,
    [PlanetType.Swamp]: 2,
    [PlanetType.Terra]: 1,
    [PlanetType.Titanium]: 1,
    [PlanetType.Volcanic]: 3,
  },
  [PlanetType.Oxide]: {
    [PlanetType.Desert]: 2,
    [PlanetType.Ice]: 2,
    [PlanetType.Oxide]: 0,
    [PlanetType.Swamp]: 3,
    [PlanetType.Terra]: 1,
    [PlanetType.Titanium]: 3,
    [PlanetType.Volcanic]: 1,
  },
  [PlanetType.Swamp]: {
    [PlanetType.Desert]: 1,
    [PlanetType.Ice]: 2,
    [PlanetType.Oxide]: 3,
    [PlanetType.Swamp]: 0,
    [PlanetType.Terra]: 3,
    [PlanetType.Titanium]: 1,
    [PlanetType.Volcanic]: 2,
  },
  [PlanetType.Terra]: {
    [PlanetType.Desert]: 3,
    [PlanetType.Ice]: 1,
    [PlanetType.Oxide]: 1,
    [PlanetType.Swamp]: 3,
    [PlanetType.Terra]: 0,
    [PlanetType.Titanium]: 2,
    [PlanetType.Volcanic]: 2,
  },
  [PlanetType.Titanium]: {
    [PlanetType.Desert]: 2,
    [PlanetType.Ice]: 1,
    [PlanetType.Oxide]: 3,
    [PlanetType.Swamp]: 1,
    [PlanetType.Terra]: 2,
    [PlanetType.Titanium]: 0,
    [PlanetType.Volcanic]: 3,
  },
  [PlanetType.Volcanic]: {
    [PlanetType.Desert]: 1,
    [PlanetType.Ice]: 3,
    [PlanetType.Oxide]: 1,
    [PlanetType.Swamp]: 2,
    [PlanetType.Terra]: 2,
    [PlanetType.Titanium]: 3,
    [PlanetType.Volcanic]: 0,
  },
} as const;
