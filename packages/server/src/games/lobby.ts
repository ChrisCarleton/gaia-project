import { LobbyDto, LobbyPlayerDto } from '@gaia-project/api';
import { FactionType } from '@gaia-project/engine';
import Logger from 'bunyan';
import { Collection, MongoClient } from 'mongodb';

import { CollectionNames, GameDocument, UserDocument } from '../data';
import { BadRequestError } from '../errors';
import { User, UserInstance } from '../users';
import { Lobby, LobbyPlayer } from './interfaces';

type LobbyPlayerData = {
  id: string;
  faction: FactionType | null;
};

export class LobbyPlayerInstance implements LobbyPlayer {
  private _user: User | undefined;

  constructor(
    private readonly data: LobbyPlayerData,
    private readonly getUser: () => Promise<User>,
  ) {}

  get id(): string {
    return this.data.id;
  }

  get faction(): FactionType | null {
    return this.data.faction;
  }
  set faction(value: FactionType | null) {
    this.data.faction = value;
  }

  async user(): Promise<User> {
    if (this._user) return this._user;

    this._user = await this.getUser();
    return this._user;
  }

  toJSON(): LobbyPlayerDto {
    return {
      user: {
        id: this.id,
        memberSince: this._user?.memberSince ?? new Date(),
        displayName: this._user?.displayName ?? '',
        avatar: this._user?.avatar,
      },
      faction: this.faction,
    };
  }
}

export class LobbyInstance implements Lobby {
  private readonly users: Collection<UserDocument>;
  private readonly games: Collection<GameDocument>;
  private readonly _players: LobbyPlayer[];
  private _owner: User | undefined;

  constructor(
    private readonly mongoClient: MongoClient,
    private readonly log: Logger,
    private data: GameDocument,
    owner?: User,
  ) {
    const db = mongoClient.db();
    this.games = db.collection(CollectionNames.Games);
    this.users = db.collection(CollectionNames.Users);
    this._players = data.players.map(
      (player) =>
        new LobbyPlayerInstance(
          { id: player.playerId, faction: player.faction ?? null },
          async () => this.getUser(player.playerId),
        ),
    );
    this._owner = owner;
  }

  get id(): string {
    return this.data._id;
  }

  get createdOn(): Date {
    return this.data.createdOn;
  }

  get updatedOn(): Date {
    return this.data.updatedOn;
  }

  get players(): Readonly<LobbyPlayer[]> {
    return this._players;
  }

  async owner(): Promise<User> {
    if (this._owner) return this._owner;
    this._owner = await this.getUser(this.data.owner);
    return this._owner;
  }

  async join(user: User): Promise<LobbyPlayer> {
    const index = this._players.findIndex((p) => p.id === user.id);
    if (index > -1) {
      // Player is already in the lobby.
      return this._players[index];
    }

    if (this._players.length >= 4) {
      // Lobby is full.
      throw new BadRequestError('Lobby is full. No new players may join.');
    }

    await this.games.updateOne(
      { _id: this.data._id },
      {
        $push: {
          players: { playerId: user.id },
        },
      },
    );

    const newPlayer = new LobbyPlayerInstance(
      {
        id: user.id,
        faction: null,
      },
      async () => user,
    );
    this._players.push(newPlayer);

    return newPlayer;
  }

  async leave(user: User): Promise<LobbyPlayer | null> {
    const index = this._players.findIndex((p) => p.id === user.id);
    if (index === -1) return null;

    // TODO: Update the array
    await this.games.updateOne(
      { _id: this.data._id },
      { $pull: { players: { playerId: user.id } } },
    );

    const [removedPlayer] = this._players.splice(index, 1);
    return removedPlayer;
  }

  async delete(): Promise<boolean> {
    const { deletedCount } = await this.games.deleteOne({ _id: this.data._id });
    return deletedCount > 0;
  }

  async save(): Promise<void> {}

  toJSON(): LobbyDto {
    return {
      id: this.id,
      createdOn: this.createdOn,
      owner: this._owner?.toJSON() ?? {
        id: this.data.owner,
        displayName: this.data.owner,
        memberSince: new Date(),
      },
      players: this.players.map((player) => player.toJSON()),
    };
  }

  private async getUser(id: string): Promise<User> {
    const data = await this.users.findOne({ _id: id });
    if (!data) {
      throw new Error(`Unable to find record of user with ID "${id}".`);
    }

    return new UserInstance(this.mongoClient, this.log, data);
  }
}
