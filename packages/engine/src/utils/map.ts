import { AxialCoordinates, Map, MapHex } from '../interfaces';

export function axialToString(coords: AxialCoordinates): string {
  const [q, r] = coords;
  return `${q},${r}`;
}

export function mapFromHexes(hexes: MapHex[]): Map {
  return hexes.reduce<Map>((map, hex) => {
    map[axialToString(hex.location)] = hex;
    return map;
  }, {});
}
