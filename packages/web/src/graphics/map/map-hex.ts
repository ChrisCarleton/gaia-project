import {
  BufferAttribute,
  BufferGeometry,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  MeshPhongMaterial,
} from 'three';

import { Sprite } from '../sprite';

const RootThree = Math.sqrt(3);
const HighlightFlashFrequency = 1000; // Two seconds.

class HightlightHexSprite implements Sprite {
  private lastTick: number;
  private dimming: boolean;
  private readonly material: MeshPhongMaterial;

  constructor(readonly mesh: Mesh) {
    this.lastTick = Date.now();
    this.dimming = false;
    this.material = mesh.material as MeshPhongMaterial;
  }

  animate(): void {
    const now = Date.now();
    const delta = ((now - this.lastTick) / HighlightFlashFrequency) * 0.5;
    if (this.dimming) {
      this.material.opacity -= delta;
      if (this.material.opacity <= 0.3) this.dimming = false;
    } else {
      this.material.opacity += delta;
      if (this.material.opacity >= 0.8) this.dimming = true;
    }

    this.lastTick = now;
  }
}

function getHexGeometry(radius: number): BufferGeometry {
  const vertices = new Float32Array([
    -0.5 * radius,
    (RootThree * radius) / 2,
    1, // Top left
    -radius,
    0,
    1,

    -radius,
    0,
    1, // Left
    -0.5 * radius,
    (-RootThree * radius) / 2,
    1,

    -0.5 * radius,
    (-RootThree * radius) / 2,
    1, // Bottom Left
    0.5 * radius,
    (-RootThree * radius) / 2,
    1,

    0.5 * radius,
    (-RootThree * radius) / 2,
    1, // Bottom Right
    radius,
    0,
    1,

    radius,
    0,
    1, // Right
    0.5 * radius,
    (RootThree * radius) / 2,
    1,

    0.5 * radius,
    (RootThree * radius) / 2,
    1, // Top Right
    -0.5 * radius,
    (RootThree * radius) / 2,
    1,
  ]);

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(vertices, 3));
  return geometry;
}

function getHighlightGeometry(radius: number): BufferGeometry {
  const vertices = new Float32Array([
    -0.5 * radius,
    (RootThree * radius) / 2,
    1, // Top left

    -radius,
    0,
    1, // Left

    -0.5 * radius,
    (-RootThree * radius) / 2,
    1, // Bottom Left

    -0.5 * radius,
    (-RootThree * radius) / 2,
    1, // Bottom Left

    0.5 * radius,
    (-RootThree * radius) / 2,
    1, // Bottom Right

    -0.5 * radius,
    (RootThree * radius) / 2,
    1, // Top left

    -0.5 * radius,
    (RootThree * radius) / 2,
    1, // Top left

    0.5 * radius,
    (-RootThree * radius) / 2,
    1, // Bottom Right

    0.5 * radius,
    (RootThree * radius) / 2,
    1, // Top Right

    0.5 * radius,
    (RootThree * radius) / 2,
    1, // Top Right

    0.5 * radius,
    (-RootThree * radius) / 2,
    1, // Bottom Right

    radius,
    0,
    1, // Right
  ]);

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  return geometry;
}

export enum HexHighlightStatus {
  Neutral,
  Good,
  Bad,
}

export const HexHighlightMaterial = {
  [HexHighlightStatus.Neutral]: new MeshPhongMaterial({
    transparent: true,
    opacity: 0.3,
    color: 0xffffff,
    reflectivity: 0.6,
    emissive: 0.6,
  }),
  [HexHighlightStatus.Good]: new MeshPhongMaterial({
    transparent: true,
    opacity: 0.3,
    color: 0x00ff00,
    reflectivity: 0.6,
    emissive: 0.6,
  }),
  [HexHighlightStatus.Bad]: new MeshPhongMaterial({
    transparent: true,
    opacity: 0.3,
    color: 0xff0000,
    reflectivity: 0.6,
    emissive: 0.6,
  }),
} as const;

export function createMapHex(radius: number): LineSegments {
  const geometry = getHexGeometry(radius);
  return new LineSegments(
    geometry,
    new LineBasicMaterial({ color: 0x555555, opacity: 0.9 }),
  );
}

export function createHighlightHex(radius: number): Sprite {
  const geometry = getHighlightGeometry(radius);
  const material = HexHighlightMaterial[HexHighlightStatus.Neutral];
  return new HightlightHexSprite(new Mesh(geometry, material));
}
