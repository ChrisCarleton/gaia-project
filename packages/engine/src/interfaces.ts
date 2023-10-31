import { SerializedPlayer, SerializedState } from './core/serialization';
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
  planet?: {
    type: PlanetType;
    player?: Player;
    structure?: StructureType;
    hasLantidMine?: boolean;
  };
  hasIvitsStation?: boolean;
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
  brainStonePosition?: 'gaia' | 1 | 2 | 3;
}

export interface PowerCycleManager extends Readonly<PowerCycle> {
  readonly totalUncharged: number;
  addNodes(nodes: number): void;
  removeNodes(nodes: number): void;
  chargeNodes(nodes: number): number;
  setValues(values: PowerCycle): void;
}

export type ResearchProgress = {
  [key in ResearchArea]: number;
};

type IncomeArray = ReadonlyArray<Readonly<Income>>;
export type FactionIncome = {
  [StructureType.Mine]: IncomeArray;
  [StructureType.TradingStation]: IncomeArray;
  [StructureType.ResearchLab]: IncomeArray;
  [StructureType.PlanetaryInstitute]: IncomeArray;
};

export enum FreeAction {
  // Take a "build a mine" or "start gaia project" action with normal range extended by 3.
  BuildMineOrStartGaiaWithRangeBoost = 'buildMineOrGaiaWithRangeBoost',

  // Take a "build a mine action" with one free Terraforming step.
  BuildMineWithTerraforming = 'buildMineWithTerraforming',

  // Earn a free QIC.
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
  locations: Readonly<AxialCoordinates[]>;

  setMax(max: number): void;
  place(location: AxialCoordinates): void;
  remove(location: AxialCoordinates): void;
}

export type PlayerStructures = {
  [key in StructureType]: Pick<
    PlayerStructureData,
    'active' | 'available' | 'locations'
  >;
};

export type ScoringTrackPositions = {
  trackA: number;
  trackB: number;
};

export interface Player {
  readonly id: string;
  readonly faction: Faction;
  readonly name: string;
  readonly powerCycle: Readonly<PowerCycle>;
  readonly resources: Readonly<Resources>;
  readonly research: Readonly<ResearchProgress>;
  readonly structures: Readonly<PlayerStructures>;
  readonly roundBooster?: Readonly<RoundBooster>;
  readonly scoringTrackPositions: Readonly<ScoringTrackPositions>;
  readonly vp: number;

  toJSON(): SerializedPlayer;
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

export enum RoundBoosterBonusType {
  Action = 'action',
  BonusOnPass = 'passBonus',
  Income = 'income',
}
export enum RoundBoosterPassBonusDiscriminator {
  Mines = 'mines',
  ResearchLabs = 'researchLabs',
  TradingStations = 'tradingStations',
  PlanetaryInstitutesAndAcadamies = 'acadamiesAndPI',
  GaiaPlanets = 'gaiaPlanets',
}
type RoundBoosterActionBonus = {
  type: RoundBoosterBonusType.Action;
  action: FreeAction;
};
type RoundBoosterIncomeBonus = {
  type: RoundBoosterBonusType.Income;
  income: Income;
};
type RoundBoosterPassBonus = {
  type: RoundBoosterBonusType.BonusOnPass;
  discriminator: RoundBoosterPassBonusDiscriminator;
  vp: number;
};
export type RoundBoosterBonus =
  | RoundBoosterActionBonus
  | RoundBoosterIncomeBonus
  | RoundBoosterPassBonus;
export interface RoundBooster {
  id: number;
  a: RoundBoosterBonus;
  b: RoundBoosterBonus;
}

export interface RoundScoringTile {}

export interface FinalScoringTile {}

export interface Round {
  scoringTile: RoundScoringTile;
}

export interface GameContext {
  readonly currentRound: number;
  readonly rounds: Readonly<Round[]>;
  readonly map: Map;
  readonly players: Readonly<Player[]>;
  readonly researchBoard: ResearchBoard;
  currentPlayer: Player | undefined;
  allowedActions: Readonly<GameAction[]>;
  roundBoosters: RoundBooster[];
}

export enum GameState {
  ChooseFirstRoundBoosters = 'chooseFirstRoundBoosters',
  GameEnded = 'gameEnded',
  GameNotStarted = 'gameNotStarted',
  BuildFirstMines = 'pickFirstMines',
  IncomePhase = 'incomePhase',
}

export enum GameAction {
  BuildMine = 'buildMine',
  Pass = 'pass',
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
  chooseRoundBoosterAndPass(roundBooster: RoundBooster): void;

  toJSON(): SerializedState;
}
