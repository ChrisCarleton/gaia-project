import { BasicMapModel } from '@gaia-project/engine/src/engine/maps';
import { Material, Matrix4, MeshPhysicalMaterial, Scene, Vector3 } from 'three';
import { createMapHex } from './map';
import { createPlanet } from './map';
import { PlanetType } from '@gaia-project/engine/src/interfaces';

const PlanetMaterials: Record<PlanetType, Material> = {
  [PlanetType.Desert]: new MeshPhysicalMaterial({ color: 0xe4ed66, reflectivity: 0.9, emissive: 0.2 }),
  [PlanetType.Gaia]: new MeshPhysicalMaterial({ color: 0x57e031, reflectivity: 0.9, emissive: 0.8 }),
  [PlanetType.Ice]: new MeshPhysicalMaterial({ color: 0xffffff, reflectivity: 0.9, emissive: 0.8 }),
  [PlanetType.Oxide]: new MeshPhysicalMaterial({ color: 0xde0030, reflectivity: 0.9, emissive: 0.2 }),
  [PlanetType.Swamp]: new MeshPhysicalMaterial({ color: 0x6c6e44, reflectivity: 0.9, emissive: 0.2 }),
  [PlanetType.Terra]: new MeshPhysicalMaterial({ color: 0x1c54ed, reflectivity: 0.9, emissive: 0.5 }),
  [PlanetType.Titanium]: new MeshPhysicalMaterial({ color: 0x4a4949, reflectivity: 0.9, emissive: 0.7 }),
  [PlanetType.Transdim]: new MeshPhysicalMaterial({ color: 0x8414f5, reflectivity: 0.9, emissive: 0.2 }),
  [PlanetType.Volcanic]: new MeshPhysicalMaterial({ color: 0xff6912, reflectivity: 0.9, emissive: 1 }),
}

// const Root = 0.707106781186548;
// const UnitVectors = {
//   Q: [(2/3) * 5, 0, 0],
//   R: [-Root * (2/3) * 10, -Root * (2/3) * 10, 0],
//   S: [-Root * (2/3) * 10, Root * (2/3) * 10, 0],
// } as const;
const HorizontalOffset = (3/2) * 2.5;
const VerticalOffset = Math.sqrt(3) * 2.5;
const UnitVectors = {
  Q: [HorizontalOffset, 0, 0],
  R: [-HorizontalOffset, -VerticalOffset, 0],
  S: [-HorizontalOffset, VerticalOffset, 0],
} as const;

const TranslationMatrix = new Matrix4(
  UnitVectors.Q[0], UnitVectors.R[0], UnitVectors.S[0], 0,
  UnitVectors.Q[1], UnitVectors.R[1], UnitVectors.S[1], 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
);

export function renderLoop(scene: Scene) {
  const mapModel = new BasicMapModel();
  const map = mapModel.createMap(3);

  const hexes = map.hexes().map((mapHex) => {
    const [q, r, s] = mapHex.location;
    const hex = createMapHex(5);

    const v = new Vector3(q, r, s).applyMatrix4(TranslationMatrix);
    hex.position.set(v.x, v.y, v.z);
    scene.add(hex);

    if (mapHex.planet) {
      const planet = createPlanet(3.5, PlanetMaterials[mapHex.planet]);
      planet.position.set(v.x, v.y, v.z);
      scene.add(planet);
    }

    return hex;
  });
}
