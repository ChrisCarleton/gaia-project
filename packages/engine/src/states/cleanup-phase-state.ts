import { SerializedState } from '../core/serialization';
import { GameState } from '../interfaces';
import { StateBase } from './state-base';

export class CleanupPhaseState extends StateBase {
  get currentState(): GameState {
    return GameState.CleanupPhase;
  }

  init(): void {
    /*
    TODO:
      1. For each player
        a. Discard unspent power
        b. Deactive activated (but unused) QICs
    */
    throw new Error('Method not implemented.');
  }

  toJSON(): SerializedState {
    return { type: GameState.CleanupPhase };
  }
}
