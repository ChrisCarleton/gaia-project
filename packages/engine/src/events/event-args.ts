import {
  GameAction,
  GameContext,
  GameState,
  Income,
  MapHex,
  Player,
  ResearchArea,
  Resources,
  RoundBooster,
  StructureType,
} from '../interfaces';

export enum EventType {
  AwaitingPlayerInput = 'awaitingPlayerInput',
  BeginRound = 'beginRound',
  GaiaformerGained = 'gaiaformerGained',
  GameEnded = 'gameEnded',
  MineBuilt = 'mineBuilt',
  IncomeGained = 'incomeGained',
  ResearchCompleted = 'researchCompleted',
  ResourcesSpent = 'resourcesSpent',
  RoundBoosterSelected = 'roundBooster',
  StructureBuilt = 'structureBuilt',
  VPAwarded = 'vpAwarded',
}

type AwaitingPlayerInputEventArgs = {
  type: EventType.AwaitingPlayerInput;
  allowedActions: Readonly<GameAction[]>;
  player: Player;
  gameState: GameState;
  gameContext: Readonly<GameContext>;
};

type BeginRoundEventArgs = {
  type: EventType.BeginRound;
  round: number;
};

type GaiaformerGainedEventArgs = {
  type: EventType.GaiaformerGained;
  player: Player;
};

type GameEndedEventArgs = {
  type: EventType.GameEnded;
  playerRanking: Readonly<Player[]>;
};

type MineBuiltEventArgs = {
  type: EventType.MineBuilt;
  player: Player;
  location: MapHex;
};

type StructureBuiltEventArgs = {
  type: EventType.StructureBuilt;
  player: Player;
  location: MapHex;
  structure: StructureType;
  previousStructure?: StructureType;
};

type IncomeGainedEventArgs = {
  type: EventType.IncomeGained;
  player: Player;
  income: Income;
};

type ResearchCompletedEventArgs = {
  type: EventType.ResearchCompleted;
  player: Player;
  area: ResearchArea;
};

type ResourcesSpentEventArgs = {
  type: EventType.ResourcesSpent;
  player: Player;
  resources: Partial<Resources>;
};

type RoundBoosterSelectedEventArgs = {
  type: EventType.RoundBoosterSelected;
  player: Player;
  roundBooster: RoundBooster;
};

type VPAwardedEventArgs = {
  type: EventType.VPAwarded;
  player: Player;
  vp: number;
  message: string;
};

export type EventArgs =
  | AwaitingPlayerInputEventArgs
  | BeginRoundEventArgs
  | GaiaformerGainedEventArgs
  | GameEndedEventArgs
  | IncomeGainedEventArgs
  | MineBuiltEventArgs
  | ResearchCompletedEventArgs
  | ResourcesSpentEventArgs
  | RoundBoosterSelectedEventArgs
  | StructureBuiltEventArgs
  | VPAwardedEventArgs;
