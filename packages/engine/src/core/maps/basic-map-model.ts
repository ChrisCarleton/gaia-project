import { AxialCoordinates, Map, MapHex, MapModel } from '../../interfaces';
import { mapFromHexes } from '../../utils';
import { getMapTiles } from './map-tiles';

const TileTranslations: AxialCoordinates[] = [
  [0, 0],
  [-2, -3],
  [-5, 2],
  [-3, 5],
  [2, 3],
  [5, -2],
  [3, -5],
  [7, 1],
  [10, -4],
  [8, -7],
];

const TwoPlayerTiles = [2, 0, 1, 3, 12, 11, 10];
const ThreeOrFourPlayerTiles = [1, 9, 8, 7, 3, 2, 0, 6, 5, 4];

export class BasicMapModel implements MapModel {
  createMap(players: number): Map {
    if (players < 2 || players > 4) {
      throw new Error('This game can only be played by 2-4 players.');
    }

    const tiles = getMapTiles();

    const hexes: MapHex[] = [];

    if (players === 2) {
      for (let i = 0; i < TwoPlayerTiles.length; i++) {
        const tileHexes: MapHex[] = tiles[TwoPlayerTiles[i]];
        for (const hex of tileHexes) {
          const [qh, rh] = hex.location;
          const [qp, rp] = TileTranslations[i];
          hex.location = [qh + qp, rh + rp];
        }
        hexes.push(...tileHexes);
      }
    } else {
      for (let i = 0; i < ThreeOrFourPlayerTiles.length; i++) {
        const tileHexes: MapHex[] = tiles[ThreeOrFourPlayerTiles[i]];
        for (const hex of tileHexes) {
          const [qh, rh] = hex.location;
          const [qp, rp] = TileTranslations[i];
          hex.location = [qh + qp, rh + rp];
        }
        hexes.push(...tileHexes);
      }
    }

    return mapFromHexes(hexes);
  }
}
