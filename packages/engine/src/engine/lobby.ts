import { FactionType, Game, MapModelType, Player } from '../interfaces';
import { ErrorCode, GPError } from './errors';
import { FactionFactory } from '../factions';
import { GameInstance } from './game';
import { BasicMapModel } from './maps';
import { Observer } from '../events/observer';
import { PlayerInstance } from './player-instance';

export class Lobby {
  private readonly players: Player[];
  private readonly events: Observer;
  private game?: Game;

  constructor(
    private readonly factionFactory: FactionFactory,
    events?: Observer,
  ) {
    this.events = events ?? new Observer();
    this.players = [];
  }

  addPlayer(name: string, faction: FactionType) {
    if (this.game) {
      throw new GPError(
        ErrorCode.GameAlreadyBegun,
        'The game has already begun. Players may not join at this time.',
      );
    }
    if (this.players.length >= 4) {
      throw new GPError(
        ErrorCode.TooManyPlayers,
        'Lobby is full. No more than four players can play this game.',
      );
    }

    const player = new PlayerInstance(
      name,
      this.factionFactory.createFaction(faction, this.events),
      this.events,
    );
    this.players.push(player);
    return player;
  }

  removePlayer(player: Player) {
    if (this.game) {
      // TODO: Once we have AI built in, this can be done more gracefully by replacing the human player with an AI-controlled replacement.
      throw new GPError(
        ErrorCode.GameAlreadyBegun,
        'The game has already begun. Unable to remove a player at this time. Please end the game first.',
      );
    }

    const index = this.players.findIndex((p) => p === player);
    if (index > -1) {
      this.players.splice(index, 1);
    }
  }

  beginGame(mapAlgorithm: MapModelType): Game {
    // TODO: Decide on algorithm based on type.
    const mapModel = new BasicMapModel();
    this.game = new GameInstance(this.players, mapModel, this.events);
    return this.game;
  }

  get currentGame(): Game | undefined {
    return this.game;
  }
}
