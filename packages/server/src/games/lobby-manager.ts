import Logger from 'bunyan';
import { randomBytes } from 'crypto';
import { Collection, MongoClient } from 'mongodb';

import { CollectionNames, GameDocument } from '../data';
import { User } from '../users';
import { Lobby, LobbyManager } from './interfaces';
import { LobbyInstance } from './lobby';

export class LobbyManagerInstance implements LobbyManager {
  private readonly games: Collection<GameDocument>;

  constructor(
    private readonly mongoClient: MongoClient,
    private readonly log: Logger,
  ) {
    this.games = mongoClient.db().collection(CollectionNames.Games);
  }

  async createLobby(owner: User): Promise<Lobby> {
    const id = randomBytes(5)
      .toString('base64url')
      .substring(0, 6)
      .toUpperCase();

    const game: GameDocument = {
      _id: id,
      createdOn: new Date(),
      owner: owner.id,
      players: [{ playerId: owner.id }],
    };

    if (this.log.debug()) {
      this.log.debug('[LOBBY] Attempting to create lobby..', game);
    }

    await this.games.insertOne(game);

    if (this.log.info()) {
      this.log.info('[LOBBY] Created lobby', game);
    }

    return new LobbyInstance(this.mongoClient, this.log, game, owner);
  }

  async deleteLobby(lobbyId: string): Promise<boolean> {
    if (this.log.debug()) {
      this.log.debug(
        `[LOBBY] Attempting to delete lobby with ID ${lobbyId}...`,
      );
    }
    const { deletedCount } = await this.games.deleteOne({ _id: lobbyId });
    return deletedCount > 0;
  }

  async getLobby(lobbyId: string): Promise<Lobby | null> {
    if (this.log.debug()) {
      this.log.debug(`[LOBBY] Attempting to load lobby with ID ${lobbyId}...`);
    }
    const data = await this.games.findOne({ _id: lobbyId });

    if (data) {
      return new LobbyInstance(this.mongoClient, this.log, data);
    }

    return null;
  }
}
