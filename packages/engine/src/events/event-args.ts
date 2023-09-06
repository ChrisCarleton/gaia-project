import {
  GameAction,
  GameState,
  MapHex,
  Player,
  Resources,
  StructureType,
} from '../interfaces';

export enum EventType {
  MineBuilt = 'mineBuilt',
  ResourcesGained = 'resourcesGained',
  ResourcesSpent = 'resourcesSpent',
  StructureBuilt = 'structureBuilt',
}

export type EventArgsBase = {
  player: Player;
};

export type AwaitingActionEventArgs = EventArgsBase & {
  currentState: GameState;
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

export type ResourcesEventArgs = EventArgsBase & {
  type: EventType.ResourcesGained | EventType.ResourcesSpent;
  resources: Partial<Resources>;
};

export type EventArgs =
  | MineBuiltEventArgs
  | ResourcesEventArgs
  | StructureBuiltEventArgs;
