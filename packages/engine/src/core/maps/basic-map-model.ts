import { CubeCoordinates, Map, MapHex, MapModel } from '../../interfaces';
import { GameMap } from './game-map';
import { getMapTiles } from './map-tiles';

type TilePositionSchema = ReadonlyArray<{
  tile: number;
  position: CubeCoordinates;
}>;

const TwoPlayerTilePositions: TilePositionSchema = [
  {
    tile: 2,
    position: [0, 0, 0],
  },
  {
    tile: 0,
    position: [-2, -3, 5],
  },
  {
    tile: 1,
    position: [-5, 2, 3],
  },
  {
    tile: 3,
    position: [-3, 5, -2],
  },
  {
    tile: 12,
    position: [2, 3, -5],
  },
  {
    tile: 11,
    position: [5, -2, -3],
  },
  {
    tile: 10,
    position: [3, -5, 2],
  },
];

const ThreeOrFourPlayerTilePositions: TilePositionSchema = [
  {
    tile: 1,
    position: [0, 0, 0],
  },
  {
    tile: 9,
    position: [-2, -3, 5],
  },
  {
    tile: 8,
    position: [-5, 2, 3],
  },
  {
    tile: 7,
    position: [-3, 5, -2],
  },
  {
    tile: 3,
    position: [2, 3, -5],
  },
  {
    tile: 2,
    position: [5, -2, -3],
  },
  {
    tile: 0,
    position: [3, -5, 2],
  },
  {
    tile: 6,
    position: [7, 1, -8],
  },
  {
    tile: 5,
    position: [10, -4, -6],
  },
  {
    tile: 4,
    position: [10, -6, 0],
  },
];

export class BasicMapModel implements MapModel {
  createMap(players: number): Map {
    if (players < 2 || players > 4) {
      throw new Error('This game can only be played by 2-4 players.');
    }

    const tiles = getMapTiles();

    const hexes: MapHex[] = [];

    if (players === 2) {
      for (const tilePosition of TwoPlayerTilePositions) {
        const tileHexes: MapHex[] = tiles[tilePosition.tile];
        for (const hex of tileHexes) {
          const [qh, rh, sh] = hex.location;
          const [qp, rp, sp] = tilePosition.position;
          hex.location = [qh + qp, rh + rp, sh + sp];
        }
        hexes.push(...tileHexes);
      }
    } else {
      for (const tilePosition of ThreeOrFourPlayerTilePositions) {
        const tileHexes: MapHex[] = tiles[tilePosition.tile];
        for (const hex of tileHexes) {
          const [qh, rh, sh] = hex.location;
          const [qp, rp, sp] = tilePosition.position;
          hex.location = [qh + qp, rh + rp, sh + sp];
        }
        hexes.push(...tileHexes);
      }
    }

    return new GameMap(hexes);
  }
}
