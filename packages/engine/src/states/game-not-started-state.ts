import { ErrorCode, GPError, GameState, State } from '..';
import { SerializedState } from '../core/serialization';

const NotStartedError = new GPError(
  ErrorCode.GameNotStarted,
  'This action is not yet valid. The game has not been started yet.',
);

export class GameNotStartedState implements State {
  get currentState(): GameState {
    return GameState.GameNotStarted;
  }

  init(): void {}

  buildMine(): void {
    throw NotStartedError;
  }

  startGaiaProject(): void {
    throw NotStartedError;
  }

  upgradeStructure(): void {
    throw NotStartedError;
  }

  formFederation(): void {
    throw NotStartedError;
  }

  advanceResearch(): void {
    throw NotStartedError;
  }

  powerOrQicAction(): void {
    throw NotStartedError;
  }

  specialAction(): void {
    throw NotStartedError;
  }

  freeAction(): void {
    throw NotStartedError;
  }

  chooseRoundBoosterAndPass(): void {
    throw NotStartedError;
  }

  completeGaiaProjects(): void {
    throw NotStartedError;
  }

  doRoundCleanup(): void {
    throw NotStartedError;
  }

  doEndGameScoring(): void {
    throw NotStartedError;
  }

  toJSON(): SerializedState {
    return {
      type: GameState.GameNotStarted,
    };
  }
}
