import { CubeCoordinates, MapHex, PlanetType } from "../../interfaces";

import HexData from './map-tiles.json';

function parseStringCoordinates(val: string): CubeCoordinates {
  const [q, r, s] = val.split(',');
  return [parseFloat(q), parseFloat(r), parseFloat(s)];
}

export function getMapTiles(): MapHex[][] {
  return HexData.map((tile) => {
    const hexes: MapHex[] = Object.entries(tile).map(([key, value]) => ({
      location: parseStringCoordinates(key),
      planet: value ? value as PlanetType : undefined,
      isSatellite: false,
    })); 
    return hexes;
  });
}
