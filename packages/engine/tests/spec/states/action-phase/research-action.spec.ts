import {
  BasicMapModel,
  EventType,
  GPError,
  GameContext,
  Player,
  ResearchArea,
  ResearchAreaNames,
  ResearchProgress,
} from '../../../../src';
import { ResearchAction } from '../../../../src/states/action-phase';
import {
  TestObserver,
  createTestContext,
  createTestPlayer,
} from '../../../util';

type CreatePlayerOptions = {
  knowledge: number;
  researchProgress: Partial<ResearchProgress>;
};

const MemoizedMap = new BasicMapModel().createMap(2);

function createPlayer(options?: Partial<CreatePlayerOptions>): Player {
  return createTestPlayer({
    resources:
      typeof options?.knowledge === 'number'
        ? { knowledge: options.knowledge }
        : { knowledge: 4 },
    research: options?.researchProgress,
  });
}

function createContext(players: Player[]): GameContext {
  return createTestContext({
    map: MemoizedMap,
    players: players,
    currentPlayer: players[0],
  });
}

describe('Action Phase: Research', () => {
  let observer: TestObserver;
  let researchAction: ResearchAction;

  beforeEach(() => {
    observer = new TestObserver();
    researchAction = new ResearchAction();
  });

  it('will throw an error if player has insufficient knowledge', () => {
    const players = [createPlayer({ knowledge: 3 }), createPlayer()];
    const context = createContext(players);
    expect(() =>
      researchAction.research(context, players[0], observer, ResearchArea.Gaia),
    ).toThrowError(GPError);
    expect(observer.events).toHaveLength(0);
  });

  it('will throw an error if player attempts to advance to tier five of a research track when it is already occupied', () => {
    const players = [
      createPlayer({ researchProgress: { economics: 4 } }),
      createPlayer({ researchProgress: { economics: 5 } }),
    ];
    const context = createContext(players);
    expect(() =>
      researchAction.research(
        context,
        players[0],
        observer,
        ResearchArea.Economics,
      ),
    ).toThrowError(GPError);
    expect(observer.events).toHaveLength(0);
  });

  it.todo(
    'will throw an error if player attempts to advance to tier five of a research track and does not specify an unactivated tech tile.',
  );

  it('will advance the player one level at the expense of four knowledge when successful', () => {
    const players = [
      createPlayer(),
      createPlayer({ researchProgress: { navigation: 2 } }),
    ];
    const context = createContext(players);
    researchAction.research(
      context,
      players[1],
      observer,
      ResearchArea.Navigation,
    );

    expect(observer.events).toContainEqual({
      type: EventType.ResourcesSpent,
      player: players[1],
      resources: {
        knowledge: 4,
      },
    });
    expect(observer.events).toContainEqual({
      type: EventType.ResearchCompleted,
      player: players[1],
      area: ResearchArea.Navigation,
    });
  });

  Object.values(ResearchArea).forEach((area) => {
    it(`will allow user to charge three power when progressing ${ResearchAreaNames[area]} to tier 3`, () => {
      const players = [
        createPlayer({ researchProgress: { [area]: 2 } }),
        createPlayer(),
      ];
      const context = createContext(players);

      researchAction.research(context, players[0], observer, area);

      const incomeEvent = observer.events.find(
        (e) => e.type === EventType.IncomeGained,
      );
      expect(incomeEvent).toBeDefined();
      const { income, player } =
        incomeEvent?.type === EventType.IncomeGained
          ? incomeEvent
          : { income: null, player: null };

      expect(income?.chargePower).toBe(3);
      expect(player).toBe(players[0]);
    });
  });

  it.todo(
    'Add more variation to the test "will award one-time resource bonus"',
  );

  it('will award one-time resource bonus', () => {
    const players = [
      createPlayer(),
      createPlayer({ researchProgress: { ai: 3 } }),
    ];
    const context = createContext(players);
    researchAction.research(
      context,
      players[1],
      observer,
      ResearchArea.Navigation,
    );

    expect(observer.events).toContainEqual({
      type: EventType.IncomeGained,
      player: players[1],
      income: {
        qic: 1,
      },
    });
  });

  [1, 3, 4].forEach((level) => {
    it(`will award a player a Gaiaformer when advancing the Gaia Project track to level ${level}`, () => {
      const players = [
        createPlayer(),
        createPlayer({ researchProgress: { gaia: level - 1 } }),
      ];
      const context = createContext(players);
      researchAction.research(context, players[1], observer, ResearchArea.Gaia);

      const event = observer.events.find(
        (e) => e.type === EventType.GaiaformerGained,
      );
      expect(event).toBeDefined();

      if (event?.type === EventType.GaiaformerGained) {
        expect(event.player).toBe(players[1]);
      } else {
        fail();
      }
    });
  });

  it.todo(
    'will award players with a federation token when mastering the Terraforming track',
  );
  it.todo(
    'will award players with the Lost Planet when mastering the Navigation track',
  );
  it.todo(
    'will award player with VP for colonized Gaia planets when mastering the Gaia Project track',
  );
});
