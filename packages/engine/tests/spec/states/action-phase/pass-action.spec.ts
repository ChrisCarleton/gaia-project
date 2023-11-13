import {
  BasicMapModel,
  EventType,
  FreeAction,
  GameContext,
  Map,
  PlanetType,
  Player,
  PlayerStructureData,
  PlayerStructures,
  RoundBooster,
  RoundBoosterBonusType,
  StructureType,
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
  map: Map;
  players: Player[];
  playerBooster: RoundBooster;
  roundBoosters: RoundBooster[];
  round: number;
};

function generateStructureData(map: Map): PlayerStructures {
  const nonGaiaPlanets = Object.values(map).filter(
    (hex) =>
      hex.planet &&
      hex.planet.type !== PlanetType.Transdim &&
      hex.planet.type !== PlanetType.Gaia,
  );
  const gaiaPlanets = Object.values(map).filter(
    (hex) => hex.planet && hex.planet.type === PlanetType.Gaia,
  );

  const DefaultStructureData: () => PlayerStructureData = () => ({
    available: 0,
    active: 0,
    locations: [],
  });
  const structures: PlayerStructures = {
    mine: { ...DefaultStructureData() },
    academy: { ...DefaultStructureData() },
    gaiaformer: { ...DefaultStructureData() },
    planetaryInstitute: { ...DefaultStructureData() },
    researchLab: { ...DefaultStructureData() },
    tradingStation: { ...DefaultStructureData() },
  };

  Object.values(StructureType).forEach((structureType, i) => {
    structures[structureType].active++;
    structures[structureType].locations.push(gaiaPlanets[i].location);
  });

  for (let i = 0; i < 10; i++) {
    if (i < 4) {
      structures.mine.active++;
      structures.mine.locations.push(nonGaiaPlanets[i].location);
    } else if (i < 7) {
      structures.tradingStation.active++;
      structures.tradingStation.locations.push(nonGaiaPlanets[i].location);
    } else if (i < 9) {
      structures.researchLab.active++;
      structures.researchLab.locations.push(nonGaiaPlanets[i].location);
    } else {
      structures.academy.active++;
      structures.academy.locations.push(nonGaiaPlanets[i].location);
    }
  }

  return structures;
}

function createContext(options?: Partial<ContextOptions>): GameContext {
  const players = options?.players ?? [
    createTestPlayer({ roundBooster: options?.playerBooster }),
    createTestPlayer(),
    createTestPlayer(),
  ];

  return createTestContext({
    map: options?.map,
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

  const RoundBoosterTestCases: {
    name: string;
    booster: number;
    expectedVP: number;
  }[] = [
    { name: 'mines', booster: 5, expectedVP: 5 },
    { name: 'research labs', booster: 6, expectedVP: 9 },
    { name: 'trading stations', booster: 7, expectedVP: 8 },
    {
      name: 'acadamies and planetary institute',
      booster: 8,
      expectedVP: 12,
    },
    {
      name: 'colonized gaia planets',
      booster: 9,
      expectedVP: 5,
    },
  ];
  RoundBoosterTestCases.forEach((test) => {
    it(`will award round booster bonus for ${test.name}`, () => {
      const [playerBooster, roundBoosters] = drawRoundBoosterForPlayer(
        test.booster,
      );
      const map = new BasicMapModel().createMap(3);
      const players = [
        createTestPlayer({
          structures: generateStructureData(map),
          roundBooster: playerBooster,
        }),
        createTestPlayer(),
        createTestPlayer(),
      ];
      const context = createContext({
        map,
        players,
        roundBoosters,
      });

      action.pass(context, players[0], events, context.roundBoosters[2]);

      expect(events.events).toContainEqual({
        type: EventType.VPAwarded,
        vp: test.expectedVP,
        player: players[0],
        message: 'Round booster bonus',
      });
    });
  });
});
