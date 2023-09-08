import { EventHandler, EventType } from './events';
import { FactionType } from './factions';

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

export type CubeCoordinates = [number, number, number];

export interface MapHex {
  location: CubeCoordinates;
  planet?: PlanetType;
  player?: Player;
  structure?: StructureType;
  isSatellite: boolean;
}

export interface Map {
  at(pt: CubeCoordinates): MapHex | undefined;
  distance(from: CubeCoordinates, to: CubeCoordinates): number;
  inRange(from: CubeCoordinates, distance: number): MapHex[];

  hexes(): ReadonlyArray<MapHex>;
}

export enum MapModelType {
  Standard = 'standard',
}

export interface MapModel {
  createMap(players: number): Map;
}

export interface FederationToken {}

export interface TechTile {}

export enum StructureType {
  Mine = 'mine',
  TradingStation = 'tradingStation',
  ResearchLab = 'researchLab',
  Academy = 'academy',
  PlanetaryInstitute = 'planetaryInstitute',
  Gaiaformer = 'gaiaformer',
  Satellite = 'satellite',
}

export enum ResearchArea {
  Terraforming = 'terraforming',
  Navigation = 'navigation',
  AI = 'ai',
  Gaia = 'gaia',
  Economics = 'economics',
  Science = 'science',
}

export interface Resources {
  credits: number;
  ore: number;
  knowledge: number;
  qic: number;
}

export interface PowerCycle {
  level1: number;
  level2: number;
  level3: number;
  gaia: number;
}

export type ResearchProgress = {
  [key in ResearchArea]: number;
};

export interface Faction {
  readonly factionType: FactionType;
  readonly homeWorld: PlanetType;
  readonly startingPowerCycle: Readonly<PowerCycle>;
  readonly startingResources: Readonly<Resources>;
  readonly startingResearch: Readonly<ResearchProgress>;
  readonly startingStructures: Readonly<Record<StructureType, number>>;
}

// export interface Structure {
//   type: StructureType;
//   location?: MapHex;
// }

export interface PlayerStructureData {
  available: number;
  locations: Readonly<MapHex[]>;

  setMax(max: number): void;
  place(location: MapHex): void;
  remove(location: MapHex): void;
}

export type PlayerStructures = {
  [key in StructureType]: Pick<PlayerStructureData, 'available' | 'locations'>;
};

export type ScoringTrackPositions = {
  trackA: number;
  trackB: number;
};

export interface Player {
  faction: Faction;
  name: string;
  powerCycle: Readonly<PowerCycle>;
  resources: Readonly<Resources>;
  research: Readonly<ResearchProgress>;
  structures: Readonly<PlayerStructures>;
  roundBooster?: RoundBooster;
  scoringTrackPositions: Readonly<ScoringTrackPositions>;
  vp: number;
}

export interface ResearchBoard {
  terraformingFederationToken: FederationToken;
  researchTracks: {
    [key in ResearchArea]: {
      mastered: boolean;
      advancedTechTile: TechTile;
      standardTechTiles: TechTile[];
    };
  };
}

export interface RoundBooster {}

export interface RoundScoringTile {}

export interface FinalScoringTile {}

export interface Round {
  scoringTile: RoundScoringTile;
}

export interface GameContext {
  readonly currentRound: number;
  readonly rounds: Readonly<Round[]>;
  readonly roundBoosters: Readonly<RoundBooster[]>;
  map: Map;
  readonly players: Readonly<Player[]>;
  researchBoard: ResearchBoard;
}

export enum GameState {
  BuildFirstMines = 'pickFirstMines',
}

export enum GameAction {
  BuildMine = 'buildMine',
}

export interface State {
  readonly currentState: GameState;

  // Player actions
  buildMine(location: MapHex): void;

  startGaiaProject(): void;
  upgradeStructure(): void;
  formFederation(): void;
  advanceResearch(): void;
  powerOrQicAction(): void;
  specialAction(): void;
  freeAction(): void;
  pass(): void;

  // Maintenance
  doIncome(): void;
  completeGaiaProjects(): void;
  doRoundCleanup(): void;
  doEndGameScoring(): void;
}

export interface Game extends State {
  readonly context: Readonly<GameContext>;

  abortGame(): void;
  subscribeToEvent(event: EventType, handler: EventHandler): void;
}
