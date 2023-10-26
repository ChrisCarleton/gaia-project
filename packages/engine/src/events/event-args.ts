import {
  GameAction,
  GameState,
  Income,
  MapHex,
  Player,
  Resources,
  RoundBooster,
  StructureType,
} from '../interfaces';

export enum EventType {
  AwaitingPlayerInput = 'awaitingPlayerInput',
  GameEnded = 'gameEnded',
  MineBuilt = 'mineBuilt',
  IncomeGained = 'incomeGained',
  ResourcesSpent = 'resourcesSpent',
  RoundBoosterSelected = 'roundBooster',
  StructureBuilt = 'structureBuilt',
  VPAwarded = 'vpAwarded',
}

type AwaitingPlayerInputEventArgs = {
  type: EventType.AwaitingPlayerInput;
  player: Player;
  gameState: GameState;
  allowedActions: GameAction[];
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

type ResourcesSpentEventArgs = {
  type: EventType.ResourcesSpent;
  player: Player;
  resources: Partial<Resources>;
};

type RoundBoosterSelectedEventArgs = {
  type: EventType.RoundBoosterSelected;
  player: Player;
  roundBooster: RoundBooster;
  exchangeFor?: RoundBooster;
};

type VPAwardedEventArgs = {
  type: EventType.VPAwarded;
  player: Player;
  vp: number;
  message: string;
};

export type EventArgs =
  | AwaitingPlayerInputEventArgs
  | GameEndedEventArgs
  | IncomeGainedEventArgs
  | MineBuiltEventArgs
  | ResourcesSpentEventArgs
  | RoundBoosterSelectedEventArgs
  | StructureBuiltEventArgs
  | VPAwardedEventArgs;
