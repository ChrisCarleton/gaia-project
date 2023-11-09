import { GPError, GameState, ResearchArea, State } from '../../../src';
import { RoundBoosters } from '../../../src/core/round-boosters';
import { GameNotStartedState } from '../../../src/states/game-not-started-state';

describe('Game Not Started State', () => {
  const state: State = new GameNotStartedState();

  it('will do nothing when init() is called', () => {
    state.init();
  });

  it('will return current state correctly', () => {
    expect(state.currentState).toBe(GameState.GameNotStarted);
  });

  it('will serialize correctly', () => {
    expect(state.toJSON()).toEqual({ type: GameState.GameNotStarted });
  });

  it('will throw an error if any action is called', () => {
    expect(() =>
      state.buildMine({
        location: [0, 0],
      }),
    ).toThrowError(GPError);
    expect(() =>
      state.chooseRoundBoosterAndPass(RoundBoosters[0]),
    ).toThrowError(GPError);
    expect(() => state.advanceResearch(ResearchArea.Gaia)).toThrowError(
      GPError,
    );
  });
});
