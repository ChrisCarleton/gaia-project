import { PlanetType } from '@gaia-project/engine';
import { Material, MeshPhysicalMaterial } from 'three';

export const StructureMaterials: Partial<Record<PlanetType, Material>> = {
  [PlanetType.Desert]: new MeshPhysicalMaterial({ color: 0xffff00 }),
  [PlanetType.Ice]: new MeshPhysicalMaterial({ color: 0xffffff }),
  [PlanetType.Oxide]: new MeshPhysicalMaterial({ color: 0xff0000 }),
  [PlanetType.Swamp]: new MeshPhysicalMaterial({ color: 0x808000 }),
  [PlanetType.Terra]: new MeshPhysicalMaterial({ color: 0x0000ff }),
  [PlanetType.Titanium]: new MeshPhysicalMaterial({ color: 0xc0c0c0 }),
  [PlanetType.Volcanic]: new MeshPhysicalMaterial({ color: 0xffa500 }),
} as const;
