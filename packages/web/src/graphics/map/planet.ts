import { PlanetType } from '@gaia-project/engine';
import {
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
  constructor(readonly mesh: Mesh) {}

  animate(): void {
    this.mesh.rotateY(0.005);
  }
}

const PlanetMaterials: Record<PlanetType, Material> = {
  [PlanetType.Desert]: new MeshPhysicalMaterial({
    color: 0xe4ed66,
    reflectivity: 0.9,
    emissive: 0.2,
  }),
  [PlanetType.Gaia]: new MeshPhysicalMaterial({
    color: 0x57e031,
    reflectivity: 0.9,
    emissive: 0.8,
  }),
  [PlanetType.Ice]: new MeshPhysicalMaterial({
    color: 0xffffff,
    reflectivity: 0.9,
    emissive: 0.8,
  }),
  [PlanetType.Oxide]: new MeshPhysicalMaterial({
    color: 0xde0030,
    reflectivity: 0.9,
    emissive: 0.2,
  }),
  [PlanetType.Swamp]: new MeshPhysicalMaterial({
    color: 0x6c6e44,
    reflectivity: 0.9,
    emissive: 0.2,
  }),
  [PlanetType.Terra]: new MeshPhongMaterial({
    map: textureLoader.load('/earth2.jpg'),
    reflectivity: 0.8,
    emissive: 0.8,
  }),
  [PlanetType.Titanium]: new MeshPhysicalMaterial({
    color: 0x4a4949,
    reflectivity: 0.9,
    emissive: 0.7,
  }),
  [PlanetType.Transdim]: new MeshPhongMaterial({
    transparent: true,
    opacity: 0.5,
    color: 0x8414f5,
    reflectivity: 0.9,
    emissive: 1,
  }),
  [PlanetType.Volcanic]: new MeshPhysicalMaterial({
    color: 0xff6912,
    reflectivity: 0.9,
    emissive: 1,
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
