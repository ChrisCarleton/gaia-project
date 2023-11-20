import { ObserverPublisher } from '../../../../src';
import { NextStateDetermination } from '../../../../src/states/action-phase/determine-next-state';
import {
  TestObserver,
  createTestContext,
  createTestPlayer,
} from '../../../util';

describe('Next State Determination For Action Phase', () => {
  let events: ObserverPublisher;

  beforeEach(() => {
    events = new TestObserver();
  });

  it('will advance to the next player in turn order (first player)', () => {
    const players = [
      createTestPlayer(),
      createTestPlayer(),
      createTestPlayer(),
      createTestPlayer(),
    ];
    const context = createTestContext({ players });

    const options = NextStateDetermination.determineNextState(
      context,
      events,
      jest.fn(),
    );

    expect(options).toMatchSnapshot();
  });

  it('will advance to the next player in turn order (third player)', () => {
    const players = [
      createTestPlayer(),
      createTestPlayer(),
      createTestPlayer(),
      createTestPlayer(),
    ];
    const context = createTestContext({ players, currentPlayer: players[2] });

    const options = NextStateDetermination.determineNextState(
      context,
      events,
      jest.fn(),
    );

    expect(options).toMatchSnapshot();
  });

  it('will return back to the start of turn order if we reach the end and not all players have passed', () => {
    const players = [
      createTestPlayer(),
      createTestPlayer(),
      createTestPlayer(),
      createTestPlayer(),
    ];
    const context = createTestContext({ players, currentPlayer: players[3] });

    const options = NextStateDetermination.determineNextState(
      context,
      events,
      jest.fn(),
    );

    expect(options).toMatchSnapshot();
  });

  it('will skip over players who have already previously passed', () => {
    const players = [
      createTestPlayer(),
      createTestPlayer({ passed: true }),
      createTestPlayer({ passed: true }),
      createTestPlayer(),
    ];
    const context = createTestContext({ players, currentPlayer: players[0] });

    const options = NextStateDetermination.determineNextState(
      context,
      events,
      jest.fn(),
    );

    expect(options).toMatchSnapshot();
  });

  it('will skip over players who have already passed AND loop back to the beginning of turn order if necessary', () => {
    const players = [
      createTestPlayer(),
      createTestPlayer(),
      createTestPlayer({ passed: true }),
      createTestPlayer({ passed: true }),
    ];
    const context = createTestContext({ players, currentPlayer: players[1] });

    const options = NextStateDetermination.determineNextState(
      context,
      events,
      jest.fn(),
    );

    expect(options).toMatchSnapshot();
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

      const options = NextStateDetermination.determineNextState(
        context,
        events,
        jest.fn(),
      );

      expect(options).toMatchSnapshot();
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

    const options = NextStateDetermination.determineNextState(
      context,
      events,
      jest.fn(),
    );

    expect(options).toMatchSnapshot();
  });
});
