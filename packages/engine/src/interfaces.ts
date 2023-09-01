// Map
export enum PlanetType {
  Desert = 'desert',
  Gaia = 'gaia',
  Ice = 'ice',
  Oxide = 'oxide',
  Swamp = 'swamp',
  Terra = 'terra',
  Titanium = 'titanium',
  Transdim = 'transdim',
  Volcanic = 'volcanic',
}

export interface Planet {
  type: PlanetType;
}

export type CubeCoordinates = [number, number, number];

export interface MapHex {
  location: CubeCoordinates;
  planet?: PlanetType;
  player?: Player;
  isSatellite: boolean;
}

export interface Map {
  at(pt: CubeCoordinates): MapHex | undefined;
  distance(from: CubeCoordinates, to: CubeCoordinates): number;
  inRange(from: CubeCoordinates, distance: number): MapHex[];

  hexes(): ReadonlyArray<MapHex>;
}

export interface MapModel {
  createMap(players: number): Map;
}

export interface FederationToken {}

export interface TechTile {}

export enum ResearchArea {
  Terraforming = 'terraforming',
  Navigation = 'navigation',
  AI = 'ai',
  Gaia = 'gaia',
  Economics = 'economics',
  Science = 'science',
}

export interface Faction {
  homeWorld: PlanetType;
}

// Players
export interface Player {
  faction: Faction;

  credits: number;
  knowledge: number;
  ore: number;
  power: [number, number, number];
  qic: number;
  research: {
    [key in ResearchArea]: number;
  }
}

export interface ResearchBoard {
  terraformingFederationToken: FederationToken;
  researchAreasMastered: {
    [key in ResearchArea]: boolean;
  }
}

export interface RoundBooster {}

export interface Round {
  booster: RoundBooster;
}

export interface Game {
  players: Player[];
  rounds: Round[];
  currentRound: number;
  state: unknown;
}
