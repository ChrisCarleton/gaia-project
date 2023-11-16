import { GameState } from '../../../../src';
import { NextStateDetermination } from '../../../../src/states/action-phase/determine-next-state';
import { createTestContext, createTestPlayer } from '../../../util';

describe('Next State Determination For Action Phase', () => {
  it('will advance to the next player in turn order (first player)', () => {
    const players = [
      createTestPlayer(),
      createTestPlayer(),
      createTestPlayer(),
      createTestPlayer(),
    ];
    const context = createTestContext({ players });

    const options = NextStateDetermination.determineNextState(context);

    expect(options).toEqual({
      nextState: GameState.ActionPhase,
      nextPlayer: players[1],
    });
  });

  it('will advance to the next player in turn order (third player)', () => {
    const players = [
      createTestPlayer(),
      createTestPlayer(),
      createTestPlayer(),
      createTestPlayer(),
    ];
    const context = createTestContext({ players, currentPlayer: players[2] });

    const options = NextStateDetermination.determineNextState(context);

    expect(options).toEqual({
      nextState: GameState.ActionPhase,
      nextPlayer: players[3],
    });
  });

  it('will return back to the start of turn order if we reach the end and not all players have passed', () => {
    const players = [
      createTestPlayer(),
      createTestPlayer(),
      createTestPlayer(),
      createTestPlayer(),
    ];
    const context = createTestContext({ players, currentPlayer: players[3] });

    const options = NextStateDetermination.determineNextState(context);

    expect(options).toEqual({
      nextState: GameState.ActionPhase,
      nextPlayer: players[0],
    });
  });

  it('will skip over players who have already previously passed', () => {
    const players = [
      createTestPlayer(),
      createTestPlayer({ passed: true }),
      createTestPlayer({ passed: true }),
      createTestPlayer(),
    ];
    const context = createTestContext({ players, currentPlayer: players[0] });

    const options = NextStateDetermination.determineNextState(context);

    expect(options).toEqual({
      nextState: GameState.ActionPhase,
      nextPlayer: players[3],
    });
  });

  it('will skip over players who have already passed AND loop back to the beginning of turn order if necessary', () => {
    const players = [
      createTestPlayer(),
      createTestPlayer(),
      createTestPlayer({ passed: true }),
      createTestPlayer({ passed: true }),
    ];
    const context = createTestContext({ players, currentPlayer: players[1] });

    const options = NextStateDetermination.determineNextState(context);

    expect(options).toEqual({
      nextState: GameState.ActionPhase,
      nextPlayer: players[0],
    });
  });

  for (let round = 1; round < 6; round++) {
    it(`will advance to clean up phase if all players have passed in round ${round}`, () => {
      const players = [
        createTestPlayer({ passed: true }),
        createTestPlayer({ passed: true }),
        createTestPlayer({ passed: true }),
        createTestPlayer({ passed: true }),
      ];
      const context = createTestContext({
        players,
        currentPlayer: players[1],
        currentRound: round,
      });

      const options = NextStateDetermination.determineNextState(context);

      expect(options).toEqual({ nextState: GameState.IncomePhase });
    });
  }

  it('will advance to game ended phase if all players have passed in the final round', () => {
    const players = [
      createTestPlayer({ passed: true }),
      createTestPlayer({ passed: true }),
      createTestPlayer({ passed: true }),
      createTestPlayer({ passed: true }),
    ];
    const context = createTestContext({
      players,
      currentPlayer: players[1],
      currentRound: 6,
    });

    const options = NextStateDetermination.determineNextState(context);

    expect(options).toEqual({ nextState: GameState.GameEnded });
  });
});
