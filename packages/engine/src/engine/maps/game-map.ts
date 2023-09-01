import { CubeCoordinates, Map, MapHex } from '../../interfaces';

export class GameMap implements Map {
  private readonly grid: Record<string, MapHex> = {};

  constructor(hexes: MapHex[]) {
    hexes.forEach((hex) => {
      const [q, r, s] = hex.location;
      this.grid[`${q},${r},${s}`] = hex;
    });
  }

  at(pt: CubeCoordinates): MapHex | undefined {
    throw new Error('Method not implemented.');
  }
  distance(from: CubeCoordinates, to: CubeCoordinates): number {
    throw new Error('Method not implemented.');
  }
  inRange(from: CubeCoordinates, distance: number): MapHex[] {
    throw new Error('Method not implemented.');
  }

  hexes(): readonly MapHex[] {
    return Object.values(this.grid);
  }
}
