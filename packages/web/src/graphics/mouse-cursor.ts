import { ConeGeometry, Mesh, MeshPhysicalMaterial } from 'three';

import { Sprite } from './sprite';

class MouseCursorSprite implements Sprite {
  constructor(readonly mesh: Mesh) {}

  animate(): void {
    this.mesh.rotateX(0.005);
    this.mesh.rotateY(0.005);
  }
}

export function createMousePointer(): Sprite {
  const cone = new ConeGeometry(3, 8);
  cone.computeVertexNormals();
  const mesh = new Mesh(
    cone,
    new MeshPhysicalMaterial({
      color: 0x00ff00,
      reflectivity: 0.9,
      emissive: 0.8,
    }),
  );
  mesh.position.set(0, 0, 10);
  return new MouseCursorSprite(mesh);
}
