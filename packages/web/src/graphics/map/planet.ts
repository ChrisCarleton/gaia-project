import { PlanetType } from '@gaia-project/engine';
import {
  Clock,
  Material,
  Mesh,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  SphereGeometry,
  TextureLoader,
  Vector3,
} from 'three';

import { Sprite } from '..';

const textureLoader = new TextureLoader();

class PlanetSprite implements Sprite {
  private readonly clock: Clock;

  constructor(readonly mesh: Mesh) {
    this.clock = new Clock(true);
  }

  animate(): void {
    this.mesh.rotateY(0.25 * this.clock.getDelta());
    this.mesh.rotateX(0.01 * this.clock.getDelta());
  }
}

const PlanetMaterials: Record<PlanetType, Material> = {
  [PlanetType.Desert]: new MeshPhongMaterial({
    map: textureLoader.load('/desert.png'),
    reflectivity: 0.9,
    emissive: 0.2,
  }),
  [PlanetType.Gaia]: new MeshPhysicalMaterial({
    color: 0x57e031,
    reflectivity: 0.9,
    emissive: 0.8,
  }),
  [PlanetType.Ice]: new MeshPhongMaterial({
    map: textureLoader.load('/ice.png'),
    reflectivity: 100.9,
  }),
  [PlanetType.Oxide]: new MeshPhongMaterial({
    map: textureLoader.load('/oxide.png'),
    reflectivity: 0.01,
    // emissive: 0x880000,
    // emissiveIntensity: 0.02,
  }),
  [PlanetType.Swamp]: new MeshPhongMaterial({
    map: textureLoader.load('/swamp.png'),
    reflectivity: 0.2,
  }),
  [PlanetType.Terra]: new MeshPhongMaterial({
    map: textureLoader.load('/earth2.jpg'),
    reflectivity: 0.8,
    emissive: 0.8,
  }),
  [PlanetType.Titanium]: new MeshPhongMaterial({
    map: textureLoader.load('/titanium.png'),
    reflectivity: 1000.0,
  }),
  [PlanetType.Transdim]: new MeshPhongMaterial({
    transparent: true,
    opacity: 0.5,
    color: 0x8414f5,
    reflectivity: 0.9,
    emissive: 1,
  }),
  [PlanetType.Volcanic]: new MeshPhongMaterial({
    map: textureLoader.load('/volcanic.png'),
    reflectivity: 0.9,
    emissiveIntensity: 0.4,
    emissive: 0xff4400,
  }),
};

export function createPlanet(
  radius: number,
  planetType: PlanetType,
  position: Vector3,
): Sprite {
  const sphere = new SphereGeometry(radius);
  sphere.computeVertexNormals();
  const mesh = new Mesh(sphere, PlanetMaterials[planetType]);
  mesh.position.set(position.x, position.y, position.z);
  return new PlanetSprite(mesh);
}
