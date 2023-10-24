import { ErrorCode, GPError } from '../errors';
import { Observer } from '../events';
import {
  ChangeStateFunction,
  GameContext,
  GameState,
  MapHex,
  State,
} from '../interfaces';

const ActionNotSupportedError = new GPError(
  ErrorCode.ActionNotSupportedNow,
  'This action is not allowed at this time.',
);

export abstract class StateBase implements State {
  constructor(
    protected readonly context: GameContext,
    protected readonly events: Observer,
    protected readonly changeState: ChangeStateFunction,
  ) {}

  abstract readonly currentState: GameState;
  abstract init(): void;

  buildMine(_location: MapHex): void {
    throw ActionNotSupportedError;
  }

  startGaiaProject(): void {
    throw ActionNotSupportedError;
  }

  upgradeStructure(): void {
    throw ActionNotSupportedError;
  }

  formFederation(): void {
    throw ActionNotSupportedError;
  }

  advanceResearch(): void {
    throw ActionNotSupportedError;
  }

  powerOrQicAction(): void {
    throw ActionNotSupportedError;
  }

  specialAction(): void {
    throw ActionNotSupportedError;
  }

  freeAction(): void {
    throw ActionNotSupportedError;
  }

  pass(): void {
    throw ActionNotSupportedError;
  }

  completeGaiaProjects(): void {
    throw ActionNotSupportedError;
  }

  doRoundCleanup(): void {
    throw ActionNotSupportedError;
  }

  doEndGameScoring(): void {
    throw ActionNotSupportedError;
  }
}
