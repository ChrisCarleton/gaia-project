import { State } from "./states/state";

export class GameContext {
  private state: State;

  constructor(initialState: State) {
    this.state = initialState;
  }

  changeState(newState: State) {
    this.state = newState;
  }

  static createGame(): GameContext {
    throw new Error('Not implemented');
  }
}