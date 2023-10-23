import { PlanetType } from '@gaia-project/engine';
import { LoadingManager, Mesh } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { Sprite } from '../sprite';
import { StructureMaterials } from './structure-materials';

const Rotation = Math.PI * (1 / 2); // 90 Degrees
const loader = new GLTFLoader(new LoadingManager());

let model: Mesh;

class MineSprite implements Sprite {
  constructor(readonly mesh: Mesh) {}
  animate(): void {}
}

function cloneModel(model: Mesh, planetType: PlanetType): Sprite {
  const clone = model.clone();
  const material = StructureMaterials[planetType];
  if (material) clone.material = material;
  return new MineSprite(clone);
}

export async function createMine(playerHomeworld: PlanetType): Promise<Sprite> {
  if (model) return cloneModel(model, playerHomeworld);
  const gltf = await loader.loadAsync('/mine.glb');

  model = gltf.scene.children[0] as Mesh;
  model.scale.set(6, 6, 6);
  model.rotateX(Rotation);

  return cloneModel(model, playerHomeworld);
}
