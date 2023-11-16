import {
  BasicMapModel,
  ChangeStateFunction,
  EventType,
  FactionType,
  GameAction,
  GameContext,
  GameState,
  State,
  StructureType,
} from '../../../src';
import { BuildFirstMinesState } from '../../../src/states/build-first-mines-state';
import {
  BuildFirstMinesOptions,
  BuildFirstMinesPass,
} from '../../../src/states/build-first-mines-turn-order';
import { TestObserver, createTestContext, createTestPlayer } from '../../util';

const events = new TestObserver();
const players = [
  createTestPlayer({ id: '0', faction: FactionType.Ambas, name: 'Randy' }),
  createTestPlayer({ id: '1', faction: FactionType.Xenos, name: 'Roger' }),
  createTestPlayer({ id: '2', faction: FactionType.Taklons, name: 'Rohma' }),
  createTestPlayer({ id: '3', faction: FactionType.Ivits, name: 'Roderika' }),
];

describe('Build First Mines State', () => {
  const map = new BasicMapModel().createMap(players.length);
  const mapHexes = Object.values(map);
  let context: GameContext;

  function createState(
    options: BuildFirstMinesOptions,
    changeState?: ChangeStateFunction,
  ): State {
    return new BuildFirstMinesState(
      context,
      events,
      changeState ?? jest.fn(),
      options,
    );
  }

  beforeEach(() => {
    context = createTestContext({ map, players });
  });

  afterEach(() => {
    events.reset();
  });

  it('Will await player input upon initialization', () => {
    const state = createState({
      pass: BuildFirstMinesPass.First,
      playerIndex: 0,
    });

    state.init();

    expect(events.events).toHaveLength(1);
    const [args] = events.events;

    expect(args.type).toBe(EventType.AwaitingPlayerInput);
    if (args.type === EventType.AwaitingPlayerInput) {
      expect(args.allowedActions).toEqual([GameAction.BuildMine]);
      expect(args.player).toBe(players[0]);
      expect(args.gameState).toBe(GameState.BuildFirstMines);
    }
  });

  it('will not allow a mine to be built out in space', () => {
    const state = createState({
      pass: BuildFirstMinesPass.First,
      playerIndex: 0,
    });
    const emptyHex = mapHexes.find((hex) => !hex.planet)!;
    expect(() => state.buildMine(emptyHex)).toThrowErrorMatchingSnapshot();
  });

  it("will not allow a mine to be built on a planet that does not match the player's homeworld", () => {
    const state = createState({
      pass: BuildFirstMinesPass.First,
      playerIndex: 0,
    });
    const nonHomeworldPlanet = mapHexes.find(
      (hex) => hex.planet && hex.planet.type !== players[0].faction.homeWorld,
    )!;
    expect(() =>
      state.buildMine(nonHomeworldPlanet),
    ).toThrowErrorMatchingSnapshot();
  });

  it('will not allow a mine to be built on a planet that already has a structure on it', () => {
    const state = createState({
      pass: BuildFirstMinesPass.First,
      playerIndex: 0,
    });
    const mapHex = mapHexes.find(
      (hex) => hex.planet?.type === players[0].faction.homeWorld,
    )!;
    mapHex.planet!.structure = StructureType.Mine;
    expect(() => state.buildMine(mapHex!)).toThrowErrorMatchingSnapshot();
  });

  it("will place a mine on an unoccupied planet that matches the current player's homeworld", () => {
    const state = createState({
      pass: BuildFirstMinesPass.First,
      playerIndex: 1,
    });
    const mapHex = mapHexes.find(
      (hex) => hex.planet?.type === players[1].faction.homeWorld,
    )!;
    state.buildMine(mapHex);

    const planet = mapHex.planet!;
    expect(planet.player).toBe(players[1]);
    expect(planet.structure).toBe(StructureType.Mine);
  });
});
