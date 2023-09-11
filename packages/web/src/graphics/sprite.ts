import { Mesh } from 'three';

export interface Sprite {
  animate(): void;
  readonly mesh: Mesh;
}
