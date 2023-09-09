import { AxialCoordinates, Map, MapHex } from '../../interfaces';

export class GameMap implements Map {
  private readonly grid: Record<string, MapHex> = {};

  constructor(hexes: MapHex[]) {
    hexes.forEach((hex) => {
      const [q, r] = hex.location;
      this.grid[`${q},${r}`] = hex;
    });
  }

  at(pt: AxialCoordinates): MapHex | undefined {
    throw new Error('Method not implemented.');
  }
  distance(from: AxialCoordinates, to: AxialCoordinates): number {
    throw new Error('Method not implemented.');
  }
  inRange(from: AxialCoordinates, distance: number): MapHex[] {
    throw new Error('Method not implemented.');
  }

  hexes(): readonly MapHex[] {
    return Object.values(this.grid);
  }
}
