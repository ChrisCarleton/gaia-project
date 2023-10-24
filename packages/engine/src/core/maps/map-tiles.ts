import { AxialCoordinates, MapHex, PlanetType } from '../../interfaces';
import { MapTileData } from './map-tile-data';

function parseStringCoordinates(val: string): AxialCoordinates {
  const [q, r] = val.split(',');
  return [parseFloat(q), parseFloat(r)];
}

export function getMapTiles(): MapHex[][] {
  return MapTileData.map((tile) => {
    const hexes: MapHex[] = Object.entries(tile).map(([key, value]) => ({
      location: parseStringCoordinates(key),
      planet: value ? (value as PlanetType) : undefined,
      isSatellite: false,
      lantidCohabitation: false,
    }));
    return hexes;
  });
}
