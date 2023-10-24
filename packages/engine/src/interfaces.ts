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

// export type CubeCoordinates = [number, number, number];
export type AxialCoordinates = [number, number];

export interface MapHex {
  location: AxialCoordinates;
  planet?: PlanetType;
  player?: Player;
  structure?: StructureType;
  isSatellite: boolean;
  lantidCohabitation: boolean;
}

export interface Map {
  at(pt: AxialCoordinates): MapHex | undefined;
  distance(from: AxialCoordinates, to: AxialCoordinates): number;
  inRange(from: AxialCoordinates, distance: number): MapHex[];

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

export interface Income extends Partial<Resources> {
  powerNodes?: number;
  chargePower?: number;
}

export interface PowerCycle {
  level1: number;
  level2: number;
  level3: number;
  gaia: number;
}

export interface PowerCycleManager extends Readonly<PowerCycle> {
  readonly totalUncharged: number;
  addNodes(nodes: number): void;
  removeNodes(nodes: number): void;
  chargeNodes(nodes: number): number;
}

export type ResearchProgress = {
  [key in ResearchArea]: number;
};

type IncomeArray = ReadonlyArray<Readonly<Income>>;
export type FactionIncome = {
  [StructureType.Mine]: IncomeArray;
  [StructureType.TradingStation]: IncomeArray;
  [StructureType.ResearchLab]: IncomeArray;
  [StructureType.PlanetaryInstitute]: Readonly<Income>;
};

export enum FreeAction {
  GenerateQIC = 'generateQIC',
}

export enum AcadamyBonusType {
  Income = 'income',
  Action = 'action',
}
export type AcadamyBonus =
  | {
      type: AcadamyBonusType.Income;
      income: Income;
    }
  | {
      type: AcadamyBonusType.Action;
      action: FreeAction;
    };

export interface Faction {
  readonly factionType: FactionType;
  readonly homeWorld: PlanetType;
  readonly startingPowerCycle: Readonly<PowerCycle>;
  readonly startingResources: Readonly<Resources>;
  readonly startingResearch: Readonly<ResearchProgress>;
  readonly startingStructures: Readonly<Record<StructureType, number>>;
  readonly acadamyBonuses: [Readonly<AcadamyBonus>, Readonly<AcadamyBonus>];
  readonly income: Readonly<FactionIncome>;
}

export interface PlayerStructureData {
  available: number;
  active: number;
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
  readonly id: string;
  readonly faction: Faction;
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
  readonly map: Map;
  readonly players: Readonly<Player[]>;
  readonly researchBoard: ResearchBoard;
  currentPlayer: Player | undefined;
  allowedActions: Readonly<GameAction[]>;

  toJSON(): Record<string, unknown>;
}

export enum GameState {
  GameEnded = 'gameEnded',
  GameNotStarted = 'gameNotStarted',
  BuildFirstMines = 'pickFirstMines',
  IncomePhase = 'incomePhase',
}

export enum GameAction {
  BuildMine = 'buildMine',
}

export type ChangeStateFunction = (nextState: State) => void;
export interface State {
  readonly currentState: GameState;

  // Initialize and transition into the new state.
  init(): void;

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
  completeGaiaProjects(): void;
  doRoundCleanup(): void;
  doEndGameScoring(): void;
}
