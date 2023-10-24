import { AxialCoordinates } from '@gaia-project/engine';
import { Matrix4, Vector3 } from 'three';

const HorizontalOffset = (3 / 2) * 2.5;
const VerticalOffset = Math.sqrt(3) * 2.5;
const UnitVectors = {
  Q: [HorizontalOffset, 0, 0],
  R: [-HorizontalOffset, -VerticalOffset, 0],
  S: [-HorizontalOffset, VerticalOffset, 0],
} as const;

export const MapTileTranslationMatrix = new Matrix4(
  UnitVectors.Q[0],
  UnitVectors.R[0],
  UnitVectors.S[0],
  0,
  UnitVectors.Q[1],
  UnitVectors.R[1],
  UnitVectors.S[1],
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  1,
);

export function mapCoordsToWorldCoords(mapLocation: AxialCoordinates): Vector3 {
  const [q, r] = mapLocation;
  return new Vector3(q, r, -q - r)
    .applyMatrix4(MapTileTranslationMatrix)
    .setZ(0);
}
