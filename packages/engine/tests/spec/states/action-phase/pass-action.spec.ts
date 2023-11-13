import {
  EventType,
  FreeAction,
  GameContext,
  RoundBooster,
  RoundBoosterBonusType,
} from '../../../../src';
import { RoundBoosters } from '../../../../src/core/round-boosters';
import { GPError } from '../../../../src/errors';
import { PassAction } from '../../../../src/states/action-phase';
import {
  TestObserver,
  createTestContext,
  createTestPlayer,
} from '../../../util';

type ContextOptions = {
  playerBooster: RoundBooster;
  roundBoosters: RoundBooster[];
  round: number;
};

function createContext(options?: Partial<ContextOptions>): GameContext {
  const players = [
    createTestPlayer({ roundBooster: options?.playerBooster }),
    createTestPlayer(),
    createTestPlayer(),
  ];

  return createTestContext({
    currentRound: options?.round,
    roundBoosters: options?.roundBoosters,
    players,
  });
}

function drawRoundBoosterForPlayer(
  index: number,
): [RoundBooster, RoundBooster[]] {
  const supplyBoosters = [...RoundBoosters];
  const playerBooster = supplyBoosters.splice(index, 1);
  return [playerBooster[0], supplyBoosters];
}

describe('Pass Action', () => {
  let events: TestObserver;
  let action: PassAction;

  beforeEach(() => {
    action = new PassAction();
    events = new TestObserver();
  });

  for (let round = 1; round < 6; round++) {
    it(`will throw an error if no round booster is selected in round ${round}`, () => {
      const context = createContext({ round });
      expect(() =>
        action.pass(context, context.players[0], events),
      ).toThrowError(GPError);
    });

    it(`will exchange the player's round booster in round ${round}`, () => {
      const [playerBooster, roundBoosters] = drawRoundBoosterForPlayer(3);
      const context = createContext({ round, playerBooster, roundBoosters });

      action.pass(context, context.players[0], events, roundBoosters[1]);

      expect(events.events).toContainEqual({
        type: EventType.RoundBoosterSelected,
        player: context.players[0],
        roundBooster: roundBoosters[1],
        previousRoundBooster: playerBooster,
      });
    });
  }

  it('will throw an error if an invalid roundbooster is selected', () => {
    const context = createContext();
    const roundBooster: RoundBooster = {
      id: 20,
      a: {
        type: RoundBoosterBonusType.Action,
        action: FreeAction.BuildMineOrStartGaiaWithRangeBoost,
      },
      b: {
        type: RoundBoosterBonusType.Action,
        action: FreeAction.GenerateQIC,
      },
    };
    expect(() =>
      action.pass(context, context.players[1], events, roundBooster),
    ).toThrowError(GPError);
  });

  it('will ignore request for new round booster in round 6', () => {
    const [playerBooster, roundBoosters] = drawRoundBoosterForPlayer(3);
    const context = createContext({ round: 6, playerBooster, roundBoosters });

    action.pass(context, context.players[0], events, roundBoosters[1]);

    expect(events.events).not.toContainEqual({
      type: EventType.RoundBoosterSelected,
      player: context.players[0],
      roundBooster: roundBoosters[1],
      previousRoundBooster: playerBooster,
    });
  });

  it.todo('will resolve any bonuses from round boosters triggered on pass');
});
