import { mockDeep } from 'jest-mock-extended';

import {
  BasicMapModel,
  EventType,
  FactionIncome,
  FreeAction,
  GameContext,
  GameState,
  Income,
  ResearchArea,
  ResearchBoard,
  ResearchProgress,
  RoundBooster,
  RoundBoosterBonusType,
  RoundBoosterPassBonusDiscriminator,
  StructureType,
} from '../../../src';
import { GaiaPhaseState } from '../../../src/states/gaia-phase-state';
import { IncomePhaseState } from '../../../src/states/income-phase-state';
import { TestObserver, createTestPlayer } from '../../util';

const events = new TestObserver();
const map = new BasicMapModel().createMap(2);

type PlayerOptions = {
  research: Partial<Record<ResearchArea, number>>;
  roundBooster: RoundBooster;
  structures: Partial<Record<StructureType, number>>;
  structureIncome: Partial<FactionIncome>;
};

const NullStructureIncome: FactionIncome = {
  [StructureType.Mine]: new Array<Income>(9).fill({}),
  [StructureType.TradingStation]: new Array<Income>(5).fill({}),
  [StructureType.PlanetaryInstitute]: [{}, {}],
  [StructureType.ResearchLab]: new Array<Income>(4).fill({}),
};

describe('Income Phase State', () => {
  function createContext(options?: Partial<PlayerOptions>): GameContext {
    const players = [
      createTestPlayer({
        id: '0',
        name: 'Test Player',
        research: options?.research,
        roundBooster: options?.roundBooster,
        structures: options?.structures,
        structureIncome: options?.structureIncome,
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
      expect(args.income).toMatchSnapshot();
    }
    expect(changeState).toBeCalledTimes(1);
  });

  const roundBoosters: Record<string, RoundBooster> = {
    'no income': {
      id: 0,
      a: {
        type: RoundBoosterBonusType.BonusOnPass,
        discriminator: RoundBoosterPassBonusDiscriminator.Mines,
        vp: 2,
      },
      b: {
        type: RoundBoosterBonusType.Action,
        action: FreeAction.BuildMineOrStartGaiaWithRangeBoost,
      },
    },
    'single income': {
      id: 1,
      a: {
        type: RoundBoosterBonusType.BonusOnPass,
        discriminator:
          RoundBoosterPassBonusDiscriminator.PlanetaryInstitutesAndAcadamies,
        vp: 4,
      },
      b: {
        type: RoundBoosterBonusType.Income,
        income: {
          qic: 1,
          powerNodes: 2,
        },
      },
    },
    'dual income': {
      id: 2,
      a: {
        type: RoundBoosterBonusType.Income,
        income: {
          ore: 7,
          knowledge: 2,
        },
      },
      b: {
        type: RoundBoosterBonusType.Income,
        income: {
          credits: 4,
          powerNodes: 2,
        },
      },
    },
  };

  Object.entries(roundBoosters).forEach(([test, roundBooster]) => {
    it(`will award income from round boosters: ${test}`, () => {
      const context = createContext({
        roundBooster,
        structureIncome: NullStructureIncome,
      });
      const changeState = jest.fn();
      const state = new IncomePhaseState(context, events, changeState);

      state.init();

      expect(events.events).toHaveLength(1);
      const [args] = events.events;
      expect(args.type).toBe(EventType.IncomeGained);
      if (args.type === EventType.IncomeGained) {
        expect(args.player).toBe(context.players[0]);
        expect(args.income).toMatchSnapshot();
      }
      expect(changeState).toBeCalledTimes(1);
    });
  });

  const ResearchVariations: Partial<ResearchProgress>[] = [
    { economics: 0, science: 0 },
    { economics: 0, science: 2 },
    { economics: 0, science: 4 },
    { economics: 0, science: 5 },
    { economics: 1, science: 0 },
    { economics: 3, science: 0 },
    { economics: 5, science: 0 },
    { economics: 2, science: 3 },
    { economics: 4, science: 2 },
  ];

  ResearchVariations.forEach((research) => {
    it(`will award income from research progress: Economics ${research.economics}, Science ${research.science}`, () => {
      const context = createContext({
        research,
        structureIncome: NullStructureIncome,
      });
      const changeState = jest.fn();
      const state = new IncomePhaseState(context, events, changeState);

      state.init();

      expect(events.events).toHaveLength(1);
      const [args] = events.events;
      expect(args.type).toBe(EventType.IncomeGained);
      if (args.type === EventType.IncomeGained) {
        expect(args.player).toBe(context.players[0]);
        expect(args.income).toMatchSnapshot();
      }
    });
  });

  it.todo('Test income from Tech Tiles');

  it.todo('will combine all income correctly');

  it('will advance to the first Gaia phase when done', () => {
    const context = createContext();
    const changeState = jest.fn();
    const state = new IncomePhaseState(context, events, changeState);

    state.init();

    expect(changeState).toBeCalledTimes(1);
    expect(changeState.mock.lastCall![0]).toBeInstanceOf(GaiaPhaseState);
  });
});
