import {
  GameAction,
  GameState,
  Income,
  MapHex,
  Player,
  Resources,
  StructureType,
} from '../interfaces';

export enum EventType {
  AwaitingPlayerInput = 'awaitingPlayerInput',
  GameEnded = 'gameEnded',
  MineBuilt = 'mineBuilt',
  IncomeGained = 'incomeGained',
  ResourcesSpent = 'resourcesSpent',
  StructureBuilt = 'structureBuilt',
  VPAwarded = 'vpAwarded',
}

export type AwaitingPlayerInputEventArgs = {
  type: EventType.AwaitingPlayerInput;
  player: Player;
  gameState: GameState;
  allowedActions: GameAction[];
};

export type GameEndedEventArgs = {
  type: EventType.GameEnded;
  playerRanking: Readonly<Player[]>;
};

export type MineBuiltEventArgs = {
  type: EventType.MineBuilt;
  player: Player;
  location: MapHex;
};

export type StructureBuiltEventArgs = {
  type: EventType.StructureBuilt;
  player: Player;
  location: MapHex;
  structure: StructureType;
  previousStructure?: StructureType;
};

export type IncomeGainedEventArgs = {
  type: EventType.IncomeGained;
  player: Player;
  income: Income;
};

export type ResourcesSpentEventArgs = {
  type: EventType.ResourcesSpent;
  player: Player;
  resources: Partial<Resources>;
};

export type VPAwardedEventArgs = {
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
  | StructureBuiltEventArgs
  | VPAwardedEventArgs;
