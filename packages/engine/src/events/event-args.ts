import {
  GameAction,
  Income,
  MapHex,
  Player,
  Resources,
  StructureType,
} from '../interfaces';

export enum EventType {
  AwaitingPlayerInput = 'awaitingPlayerInput',
  MineBuilt = 'mineBuilt',
  IncomeGained = 'incomeGained',
  ResourcesSpent = 'resourcesSpent',
  StructureBuilt = 'structureBuilt',
}

export type EventArgsBase = {
  player: Player;
};

export type AwaitingPlayerInputEventArgs = EventArgsBase & {
  type: EventType.AwaitingPlayerInput;
  allowedActions: GameAction[];
};

export type MineBuiltEventArgs = EventArgsBase & {
  type: EventType.MineBuilt;
  location: MapHex;
};

export type StructureBuiltEventArgs = EventArgsBase & {
  type: EventType.StructureBuilt;
  location: MapHex;
  structure: StructureType;
  previousStructure?: StructureType;
};

export type IncomeGainedEventArgs = EventArgsBase & {
  type: EventType.IncomeGained;
  income: Income;
};

export type ResourcesSpentEventArgs = EventArgsBase & {
  type: EventType.ResourcesSpent;
  resources: Partial<Resources>;
};

export type EventArgs =
  | AwaitingPlayerInputEventArgs
  | IncomeGainedEventArgs
  | MineBuiltEventArgs
  | ResourcesSpentEventArgs
  | StructureBuiltEventArgs;
