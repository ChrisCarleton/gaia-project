import {
  FactionType,
  Lobby,
  LobbyPlayer,
  Observer,
  PlayerFactory,
} from '../../../src';

jest.mock('../../../src/players/player-factory');

describe('Game lobby', () => {
  const events = new Observer();
  let playerFactory: PlayerFactory;
  let lobby: Lobby;

  beforeEach(() => {
    events.reset();
    lobby = new Lobby(playerFactory, events);
  });

  it('will add a player', () => {
    const name = 'Rick';
    const faction = FactionType.Ambas;
    lobby.addPlayer(name, faction);
    const [player] = lobby.players;
    expect(player).toEqual({ name, faction });
  });

  it('Will add up to four players', () => {
    const players: LobbyPlayer[] = [
      { name: 'Rob', faction: FactionType.Itars },
      { name: 'Jess', faction: FactionType.Bescods },
      { name: 'Tim', faction: FactionType.Gleens },
      { name: 'Sara', faction: FactionType.Terrans },
    ];
    players.forEach((p) => lobby.addPlayer(p.name, p.faction));
    expect(lobby.players).toEqual(players);
  });

  it('Will remove a player from the lobby');
});
