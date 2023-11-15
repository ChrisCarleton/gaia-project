import { SerializedPlayer, SerializedState } from './core/serialization';

export enum FactionType {
  Ambas = 'ambas',
  BalTaks = 'balTaks',
  Bescods = 'bescods',
  Firaks = 'firaks',
  Geodens = 'geodens',
  Gleens = 'gleens',
  HadschHallas = 'hadschHallas',
  Itars = 'itars',
  Ivits = 'ivits',
  Nevlas = 'nevlas',
  Lantids = 'lantids',
  Taklons = 'taklons',
  Terrans = 'terrans',
  Xenos = 'xenos',
}

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

export type Map = Record<string, MapHex>;

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
  // Spend 4 power to generate 1 QIC.
  GenerateQIC = 'generateQIC',

  // Spend 3 power to generate 1 ore.
  GenerateOre = 'generateOre',

  // Spend 4 power to generate 1 knowledge.
  GenerateKnowledge = 'generateKnowledge',

  // Spend 1 power to generate 1 credit.
  GenerateCredit = 'generateCredit',

  // Exchange 1 ore for 1 credit.
  TradeOreForCredit = 'tradeOreForCredit',

  // Exchange 1 ore for 1 power node.
  TradeOreForPowerNode = 'tradeOreForPowerNode',

  // Exchange 1 QIC for 1 ore.
  TradeQICForOre = 'tradeQICForOre',

  // Exchange 1 knowledge for 1 credit.
  TradeKnowledgeForCredit = 'tradeKnowledgeForCredit',
}

export enum SpecialAction {
  // Take a "build a mine" or "start gaia project" action with normal range extended by 3.
  BuildMineOrStartGaiaWithRangeBoost = 'buildMineOrGaiaWithRangeBoost',

  // Take a "build a mine action" with one free Terraforming step.
  BuildMineWithTerraforming = 'buildMineWithTerraforming',

  // Earn a free QIC.
  GenerateQIC = 'generateQIC',

  // Player receives a one-time bonus of four credits.
  Receive4Credits = 'receive4Credits',
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
      action: SpecialAction;
    };

export interface Faction {
  readonly factionType: FactionType;
  readonly homeWorld: PlanetType;
  readonly startingPowerCycle: Readonly<PowerCycle>;
  readonly startingResources: Readonly<Resources>;
  readonly startingResearch: Readonly<ResearchProgress>;
  readonly startingStructures: Readonly<Record<StructureType, number>>;
  readonly acadamyBonuses: Readonly<{ a: AcadamyBonus; b: AcadamyBonus }>;
  readonly income: Readonly<FactionIncome>;
}

export interface PlayerStructureData {
  available: number;
  active: number;
  locations: AxialCoordinates[];
}

export type PlayerStructures = {
  [key in StructureType]: PlayerStructureData;
};

export type ScoringTrackPositions = {
  trackA: number;
  trackB: number;
};

export interface PlayerInfo {
  id: string;
  name: string;
  faction: FactionType;
}

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
  readonly passed: boolean;

  toJSON(): SerializedPlayer;
}

export interface ResearchBoard {
  terraformingFederationToken: FederationToken;
  researchTracks: {
    [key in ResearchArea]: {
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
  action: SpecialAction;
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

export enum RoundScoringBonus {
  AcadamyOrPlanetaryInstitute5VP = 'acadamyOrPlanetaryInstitute5VP',
  FederationToken5VP = 'federationToken5VP',
  GaiaPlanet3VP = 'gaiaPlanet3VP',
  GaiaPlanet4VP = 'gaiaPlanet4VP',
  Mines2VP = 'mines2VP',
  Research2VP = 'research2VP',
  Terraforming2VP = 'terraforming2VP',
  TradingStations3VP = 'tradingStations3VP',
  TradingStations4VP = 'tradingStations4VP',
}

export interface FinalScoringTile {
  neutralPlayerRank: number;
}

export interface GameContext {
  readonly currentRound: number;
  readonly roundScoringBonuses: Readonly<RoundScoringBonus[]>;
  readonly map: Map;
  readonly players: Readonly<Player[]>;
  readonly passOrder: Readonly<Player[]>;
  readonly researchBoard: ResearchBoard;
  readonly currentPlayer: Player;
  readonly allowedActions: Readonly<GameAction[]>;
  readonly roundBoosters: RoundBooster[];
}

export enum GameState {
  ActionPhase,
  ChooseFirstRoundBoosters = 'chooseFirstRoundBoosters',
  GaiaPhase = 'gaiaPhase',
  GameEnded = 'gameEnded',
  GameNotStarted = 'gameNotStarted',
  BuildFirstMines = 'pickFirstMines',
  IncomePhase = 'incomePhase',
}

export enum GameAction {
  BuildMine = 'buildMine',
  FormFederation = 'formFederation',
  Free = 'free',
  GaiaProject = 'gaiaProject',
  Pass = 'pass',
  PowerOrQic = 'powerOrQIC',
  Research = 'research',
  SelectRoundBooster = 'selectRoundBooster',
  Special = 'special',
  UpgradeStructure = 'upgradeStructure',
}

export type ChangeStateFunction = (nextState: State) => void;
export interface State {
  readonly currentState: GameState;

  // Initialize and transition into the new state.
  init(): void;

  // Player actions
  buildMine(location: MapHex): void;
  startGaiaProject(location: MapHex): void;
  upgradeStructure(): void;
  formFederation(): void;
  advanceResearch(area: ResearchArea): void;
  powerOrQicAction(): void;
  specialAction(): void;
  freeAction(): void;
  pass(roundBooster?: RoundBooster): void;

  toJSON(): SerializedState;
}
