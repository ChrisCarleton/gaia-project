import { GameContext, GameState, MapHex, State } from '../interfaces';
import { ErrorCode, GPError } from '../engine/errors';
import { Observer } from '../events';

const ActionNotSupportedError = new GPError(
  ErrorCode.ActionNotSupportedNow,
  'This action is not allowed at this time.',
);

export abstract class StateBase implements State {
  constructor(
    protected readonly context: GameContext,
    protected readonly events: Observer,
    protected readonly changeState: (nextState: State) => void,
  ) {}

  abstract readonly currentState: GameState;

  buildMine(location: MapHex): void {
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

  doIncome(): void {
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
