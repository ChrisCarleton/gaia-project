import {
  ErrorCode,
  FactionType,
  GPError,
  Game,
  MapModel,
  MapModelType,
  Observer,
  PlayerFactory,
} from '..';
import { GameInstance } from './game';
import { BasicMapModel } from './maps';

const MapModels: Record<MapModelType, () => MapModel> = {
  [MapModelType.Standard]: () => new BasicMapModel(),
} as const;

export type LobbyPlayer = {
  name: string;
  faction: FactionType;
};

export class Lobby {
  private readonly _players: LobbyPlayer[];
  private readonly events: Observer;
  private game?: Game;

  constructor(
    private readonly playerFactory: PlayerFactory,
    events?: Observer,
  ) {
    this.events = events ?? new Observer();
    this._players = [];
  }

  addPlayer(name: string, faction: FactionType): void {
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

    this._players.push({ name, faction });
  }

  removePlayer(player: number) {
    if (this.game) {
      // TODO: Once we have AI built in, this can be done more gracefully by replacing the human player with an AI-controlled replacement.
      throw new GPError(
        ErrorCode.GameAlreadyBegun,
        'The game has already begun. Unable to remove a player at this time. Please end the game first.',
      );
    }

    if (player < 0 || player >= this._players.length) {
      throw new Error(
        `Unable to return player at position ${player}: No such player.`,
      );
    }

    this._players.splice(player, 1);
  }

  beginGame(mapAlgorithm: MapModelType): Game {
    const mapModel = MapModels[mapAlgorithm]();
    const players = this._players.map((player) =>
      this.playerFactory.createPlayer(player.faction, player.name),
    );
    this.game = new GameInstance(players, mapModel, this.events);
    return this.game;
  }

  get currentGame(): Game | undefined {
    return this.game;
  }

  get players(): Readonly<LobbyPlayer[]> {
    return [...this._players];
  }
}
