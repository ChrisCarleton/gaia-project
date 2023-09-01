import { Material, Mesh, SphereGeometry } from "three";

export function createPlanet(radius: number, material: Material) {
  const sphere = new SphereGeometry(radius);
  sphere.computeVertexNormals();
  return new Mesh(sphere, material);
}
