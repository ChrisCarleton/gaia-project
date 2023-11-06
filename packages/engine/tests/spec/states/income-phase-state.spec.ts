import { mockDeep } from 'jest-mock-extended';

import {
  BasicMapModel,
  EventType,
  FactionType,
  GameContext,
  GameState,
  ResearchBoard,
  RoundBooster,
  State,
  StructureType,
} from '../../../src';
import { IncomePhaseState } from '../../../src/states/income-phase-state';
import { TestObserver, createTestPlayer } from '../../util';

const events = new TestObserver();
const map = new BasicMapModel().createMap(2);

type PlayerOptions = {
  rountBooster: RoundBooster;
  structures: Partial<Record<StructureType, number>>;
};

describe('Income Phase State', () => {
  function createContext(options?: Partial<PlayerOptions>): GameContext {
    const players = [
      createTestPlayer({
        id: '0',
        name: 'Test Player',
        structures: options?.structures,
      }),
    ];

    return {
      allowedActions: [],
      currentRound: 1,
      currentPlayer: players[0],
      map,
      players,
      researchBoard: mockDeep<ResearchBoard>(),
      roundBoosters: [],
      rounds: [],
    };
  }

  beforeEach(() => {});

  afterEach(() => {
    events.reset();
  });

  it('will return the correct current state', () => {
    const state = new IncomePhaseState(createContext(), events, jest.fn());
    expect(state.currentState).toBe(GameState.IncomePhase);
  });

  it('will award income from established structures', () => {
    const context = createContext({
      structures: {
        mine: 4,
        tradingStation: 3,
        researchLab: 2,
        planetaryInstitute: 1,
      },
    });
    const changeState = jest.fn();
    const state = new IncomePhaseState(context, events, changeState);

    state.init();

    expect(events.events).toHaveLength(1);
    const [args] = events.events;
    expect(args.type).toBe(EventType.IncomeGained);
    if (args.type === EventType.IncomeGained) {
      expect(args.player).toBe(context.players[0]);
      expect(args.income).toEqual({});
    }
    expect(changeState).toBeCalledTimes(1);
  });

  it('will award income from round boosters', () => {});

  it('will award income from research progress', () => {});

  it.todo('Test income from Tech Tiles');

  it('will combine all income correctly', () => {});

  it('will advance to the first Gaia phase when done', () => {});
});
