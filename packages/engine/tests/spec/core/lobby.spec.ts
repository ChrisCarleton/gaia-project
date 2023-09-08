import { It, Mock } from 'moq.ts';

import {
  Faction,
  FactionFactory,
  FactionType,
  Lobby,
  Observer,
} from '../../../src';

class TestFactionFactory implements FactionFactory {
  createFaction(type: FactionType, events: Observer): Faction {
    return new Mock<Faction>()
      .setup((f) => f.factionType)
      .returns(type)
      .object();
  }
}

describe('Game lobby', () => {
  const factionFactory = new TestFactionFactory();
  let lobby: Lobby;

  beforeEach(() => {
    lobby = new Lobby(factionFactory);
  });

  it.skip('will add a player', () => {
    const name = 'Rick';
    const player = lobby.addPlayer(name, FactionType.Ambas);
    expect(player).toBeDefined();
    expect(lobby.players).toContain(player);
  });
});
