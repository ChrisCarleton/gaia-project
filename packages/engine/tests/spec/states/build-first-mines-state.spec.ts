import {
  ChangeStateFunction,
  EventType,
  GameContext,
  GameState,
  Observer,
  Player,
  State,
} from '../../../src';
import { Ambas } from '../../../src/factions/ambas';
import { BalTAks } from '../../../src/factions/bal-t-aks';
import { Terrans } from '../../../src/factions/terrans';
import {
  BuildFirstMinesOptions,
  BuildFirstMinesPass,
  BuildFirstMinesState,
} from '../../../src/states/build-first-mines-state';
import { createTestContext, createTestPlayer } from '../../util';

function createTestPlayers(events: Observer = new Observer()): Player[] {
  const players: Player[] = [
    createTestPlayer({
      name: 'Paul',
      faction: new Terrans(events),
      events,
    }),
    createTestPlayer({
      name: 'Jessica',
      faction: new Ambas(events),
      events,
    }),
    createTestPlayer({
      name: 'Duncan',
      faction: new BalTAks(events),
      events,
    }),
  ];

  return players;
}

type CreateTestStateOptions = {
  context: GameContext;
  events?: Observer;
  changeState?: ChangeStateFunction;
  options?: BuildFirstMinesOptions;
  players?: Player[];
};

function createTestState({
  context,
  events,
  changeState,
  options,
}: CreateTestStateOptions): State {
  return new BuildFirstMinesState(
    context,
    events ?? new Observer(),
    changeState ?? (() => {}),
    options ?? {
      pass: BuildFirstMinesPass.First,
      turnIndex: 0,
    },
  );
}

describe('Build first mines state', () => {
  it('will signal to current player that they need to place a mine on initialization', () => {
    const events = new Observer();
    const players = createTestPlayers(events);
    const context = createTestContext({ players });
    const state = createTestState({
      context,
      events,
      options: {
        pass: BuildFirstMinesPass.First,
        turnIndex: 1,
      },
    });

    const spy = jest.spyOn(events, 'publish');
    state.init();

    expect(spy).toBeCalledWith({
      type: EventType.AwaitingPlayerInput,
      player: players[1],
      gameState: GameState.BuildFirstMines,
    });
  });
});
