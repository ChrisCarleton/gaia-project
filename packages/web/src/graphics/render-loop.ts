import { BasicMapModel } from '@gaia-project/engine/src/core/maps';
import { PlanetType } from '@gaia-project/engine/src/interfaces';
import {
  Material,
  Matrix4,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  Scene,
  TextureLoader,
  Vector3,
} from 'three';

import { Sprite } from '.';
import { createMapHex } from './map';
import { createPlanet } from './map';

// const Root = 0.707106781186548;
// const UnitVectors = {
//   Q: [(2/3) * 5, 0, 0],
//   R: [-Root * (2/3) * 10, -Root * (2/3) * 10, 0],
//   S: [-Root * (2/3) * 10, Root * (2/3) * 10, 0],
// } as const;
export function renderLoop(scene: Scene, addSprite: (sprite: Sprite) => void) {}
