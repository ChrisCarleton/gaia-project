import { It, Mock } from 'moq.ts';

import {
  Faction,
  FactionHomeWorlds,
  FactionType,
  Lobby,
  LobbyPlayer,
  MapModelType,
  Observer,
  Player,
  PlayerFactory,
} from '../../../src';

describe('Game lobby', () => {
  const events = new Observer();
  let playerFactory: PlayerFactory;
  let lobby: Lobby;

  beforeEach(() => {
    events.reset();
    playerFactory = new Mock<PlayerFactory>()
      .setup((f) => f.createPlayer(It.IsAny<FactionType>(), It.IsAny<string>()))
      .callback(({ args: [faction, name] }) => {
        return new Mock<Player>()
          .setup((p) => p.faction)
          .returns(
            new Mock<Faction>()
              .setup((f) => f.factionType)
              .returns(faction)
              .setup((f) => f.homeWorld)
              .returns(FactionHomeWorlds[faction as FactionType])
              .object(),
          )
          .setup((p) => p.name)
          .returns(name)
          .object();
      })
      .object();
    lobby = new Lobby(playerFactory, events);
  });

  it('will add a player', () => {
    const name = 'Rick';
    const faction = FactionType.Ambas;
    lobby.addPlayer(name, faction);
    const [player] = lobby.players;
    expect(player).toEqual({ name, faction });
  });

  it('will add up to four players', () => {
    const players: LobbyPlayer[] = [
      { name: 'Rob', faction: FactionType.Itars },
      { name: 'Jess', faction: FactionType.Bescods },
      { name: 'Tim', faction: FactionType.Gleens },
      { name: 'Sara', faction: FactionType.Terrans },
    ];
    players.forEach((p) => lobby.addPlayer(p.name, p.faction));
    expect(lobby.players).toEqual(players);
  });

  it('will throw an error if addPlayer is called when the lobby is already full', () => {
    const players: LobbyPlayer[] = [
      { name: 'Rob', faction: FactionType.Itars },
      { name: 'Jess', faction: FactionType.Bescods },
      { name: 'Tim', faction: FactionType.Gleens },
      { name: 'Sara', faction: FactionType.Terrans },
    ];
    players.forEach((p) => lobby.addPlayer(p.name, p.faction));

    expect(() => lobby.addPlayer('Sam', FactionType.Nevlas)).toThrowError();
  });

  it('will remove a player from the lobby', () => {
    const players: LobbyPlayer[] = [
      { name: 'Rob', faction: FactionType.Itars },
      { name: 'Jess', faction: FactionType.Bescods },
      { name: 'Tim', faction: FactionType.Gleens },
      { name: 'Sara', faction: FactionType.Terrans },
    ];
    players.forEach((p) => lobby.addPlayer(p.name, p.faction));

    lobby.removePlayer(1);
    expect(lobby.players).toEqual([players[0], players[2], players[3]]);
  });

  it('will throw an error if removePlayer is called with invalid index', () => {
    lobby.addPlayer('John', FactionType.HadschHallas);
    expect(() => lobby.removePlayer(-1)).toThrowError();
    expect(() => lobby.removePlayer(1)).toThrowError();
  });

  it('will throw an exception if game is begun with conflicting factions', () => {
    lobby.addPlayer('Jim', FactionType.Xenos);
    lobby.addPlayer('Harris', FactionType.Xenos);
    expect(() => lobby.beginGame(MapModelType.Standard)).toThrowError();
  });

  it('will throw an exception if game is begun with conflicting home worlds', () => {
    lobby.addPlayer('Jim', FactionType.Terrans);
    lobby.addPlayer('Harris', FactionType.Lantids);
    expect(() => lobby.beginGame(MapModelType.Standard)).toThrowError();
  });

  it('will throw an exception if a game is begun with less than two players', () => {
    lobby.addPlayer('Jim', FactionType.Terrans);
    expect(() => lobby.beginGame(MapModelType.Standard)).toThrowError();
  });

  it('will return a reference to the game when it has begun', () => {
    const players: LobbyPlayer[] = [
      { name: 'Rob', faction: FactionType.Itars },
      { name: 'Jess', faction: FactionType.Bescods },
      { name: 'Tim', faction: FactionType.Gleens },
      { name: 'Sara', faction: FactionType.Terrans },
    ];
    players.forEach((p) => lobby.addPlayer(p.name, p.faction));

    const game = lobby.beginGame(MapModelType.Standard);

    expect(game).toBeDefined();
    expect(lobby.currentGame).toBe(game);
  });

  it('will throw an exception if addPlayer is called after the game has begun', () => {
    const players: LobbyPlayer[] = [
      { name: 'Rob', faction: FactionType.Itars },
      { name: 'Jess', faction: FactionType.Bescods },
    ];
    players.forEach((p) => lobby.addPlayer(p.name, p.faction));

    lobby.beginGame(MapModelType.Standard);

    expect(() => lobby.addPlayer('Roger', FactionType.Geodens)).toThrowError();
  });

  it('will throw an exception if removePlayer is called after the game has begun', () => {
    const players: LobbyPlayer[] = [
      { name: 'Rob', faction: FactionType.Itars },
      { name: 'Jess', faction: FactionType.Bescods },
      { name: 'Tim', faction: FactionType.Gleens },
      { name: 'Sara', faction: FactionType.Terrans },
    ];
    players.forEach((p) => lobby.addPlayer(p.name, p.faction));

    lobby.beginGame(MapModelType.Standard);

    expect(() => lobby.removePlayer(1)).toThrowError();
  });
});
