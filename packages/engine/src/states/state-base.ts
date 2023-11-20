/* eslint-disable @typescript-eslint/no-unused-vars */
import { SerializedState } from '../core/serialization';
import { ErrorCode, GPError } from '../errors';
import { ObserverPublisher } from '../events';
import {
  ChangeStateFunction,
  FreeAction,
  GameContext,
  GameState,
  MapHex,
  ResearchArea,
  RoundBooster,
  State,
} from '../interfaces';

const ActionNotSupportedError = new GPError(
  ErrorCode.ActionNotSupportedNow,
  'This action is not allowed at this time.',
);

export abstract class StateBase implements State {
  constructor(
    protected readonly context: GameContext,
    protected readonly events: ObserverPublisher,
    protected readonly changeState: ChangeStateFunction,
  ) {}

  abstract readonly currentState: GameState;
  abstract init(): void;
  abstract toJSON(): SerializedState;

  buildMine(location: MapHex): void {
    throw ActionNotSupportedError;
  }

  startGaiaProject(location: MapHex): void {
    throw ActionNotSupportedError;
  }

  upgradeStructure(): void {
    throw ActionNotSupportedError;
  }

  formFederation(): void {
    throw ActionNotSupportedError;
  }

  advanceResearch(area: ResearchArea): void {
    throw ActionNotSupportedError;
  }

  powerOrQicAction(): void {
    throw ActionNotSupportedError;
  }

  specialAction(): void {
    throw ActionNotSupportedError;
  }

  freeAction(action: FreeAction): void {
    throw ActionNotSupportedError;
  }

  pass(roundBooster?: RoundBooster): void {
    throw ActionNotSupportedError;
  }
}
