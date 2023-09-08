import { CubeCoordinates } from '../..';

export const DirectionVectors: ReadonlyArray<CubeCoordinates> = [
  [1, 0, -1],
  [1, -1, 0],
  [0, -1, 1],
  [-1, 0, 1],
  [-1, 1, 0],
  [0, 1, -1],
];

type MapTile = {
  [key: string]: string | null;
};

export function cubeScale(
  hex: CubeCoordinates,
  factor: number,
): CubeCoordinates {
  const [q, r, s] = hex;
  return [q * factor, r * factor, s * factor];
}

export function cubeAdd(
  a: CubeCoordinates,
  b: CubeCoordinates,
): CubeCoordinates {
  const [aq, ar, as] = a;
  const [bq, br, bs] = b;
  return [aq + bq, ar + br, as + bs];
}

export function cubeRing(
  center: CubeCoordinates,
  radius: number,
): CubeCoordinates[] {
  const results: CubeCoordinates[] = [];

  let hex = cubeAdd(center, cubeScale(DirectionVectors[4], radius));

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < radius; j++) {
      results.push(hex);
      hex = cubeAdd(hex, DirectionVectors[i]);
    }
  }

  return results;
}

export function makeAMapTile(): MapTile {
  const tiles: MapTile = {
    '0,0,0': null,
  };

  cubeRing([0, 0, 0], 1).forEach(([q, r, s]) => {
    tiles[`${q},${r},${s}`] = null;
  });
  cubeRing([0, 0, 0], 2).forEach(([q, r, s]) => {
    tiles[`${q},${r},${s}`] = null;
  });

  return tiles;
}
