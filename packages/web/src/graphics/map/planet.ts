import { AxialCoordinates } from '@gaia-project/engine';
import { Material, Mesh, SphereGeometry, Vector3 } from 'three';

import { Sprite } from '..';

class PlanetSprite implements Sprite {
  constructor(readonly mesh: Mesh) {}

  animate(): void {
    this.mesh.rotateY(0.01);
  }
}

export function createPlanet(
  radius: number,
  material: Material,
  position: Vector3,
): Sprite {
  const sphere = new SphereGeometry(radius);
  sphere.computeVertexNormals();
  const mesh = new Mesh(sphere, material);
  mesh.position.set(position.x, position.y, position.z);
  return new PlanetSprite(mesh);
}
