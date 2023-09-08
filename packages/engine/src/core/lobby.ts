import {
  ErrorCode,
  FactionFactory,
  FactionType,
  GPError,
  Game,
  MapModelType,
  Observer,
  Player,
} from '..';
import { HumanPlayer } from '../players';
import { GameInstance } from './game';
import { BasicMapModel } from './maps';

export class Lobby {
  private readonly _players: Player[];
  private readonly events: Observer;
  private game?: Game;

  constructor(
    private readonly factionFactory: FactionFactory,
    events?: Observer,
  ) {
    this.events = events ?? new Observer();
    this._players = [];
  }

  addPlayer(name: string, faction: FactionType): Player {
    if (this.game) {
      throw new GPError(
        ErrorCode.GameAlreadyBegun,
        'The game has already begun. Players may not join at this time.',
      );
    }
    if (this._players.length >= 4) {
      throw new GPError(
        ErrorCode.TooManyPlayers,
        'Lobby is full. No more than four players can play this game.',
      );
    }

    const player = new HumanPlayer(
      name,
      this.factionFactory.createFaction(faction, this.events),
      this.events,
    );
    this._players.push(player);
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

    const index = this._players.findIndex((p) => p === player);
    if (index > -1) {
      this._players.splice(index, 1);
    }
  }

  beginGame(mapAlgorithm: MapModelType): Game {
    // TODO: Decide on algorithm based on type.
    const mapModel = new BasicMapModel();
    this.game = new GameInstance(this._players, mapModel, this.events);
    return this.game;
  }

  get currentGame(): Game | undefined {
    return this.game;
  }

  get players(): Readonly<Player[]> {
    return [...this._players];
  }
}
