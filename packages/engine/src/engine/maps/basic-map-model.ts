import { getMapTiles } from "./map-tiles";
import { Map, MapModel } from "../../interfaces";
import { GameMap } from "./game-map";

export class BasicMapModel implements MapModel {
  createMap(players: number): Map {
    if (players < 2 || players > 4) {
      throw new Error('This game can only be played by 2-4 players.');
    }

    const hexes = getMapTiles();
    return new GameMap(hexes);
  }
}