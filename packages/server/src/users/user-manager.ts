import Logger from 'bunyan';
import { Collection, MongoClient } from 'mongodb';
import { v4 as uuid } from 'uuid';

import { CollectionNames, UserDocument } from '../data';
import { assertValid } from '../utils';
import {
  CreateUserOptions,
  CreateUserOptionsSchema,
  User,
  UserManager,
} from './interfaces';
import { UserInstance } from './user';

export class UserManagerInstance implements UserManager {
  private readonly users: Collection<UserDocument>;

  constructor(
    private readonly mongoClient: MongoClient,
    private readonly log: Logger,
  ) {
    this.users = mongoClient.db().collection(CollectionNames.Users);
  }

  async createUser(options: CreateUserOptions): Promise<User> {
    options = assertValid(options, CreateUserOptionsSchema);
    const data: UserDocument = {
      _id: uuid(),
      email: options.email,
      emailLowered: options.email.toLocaleLowerCase(),
      displayName: options.displayName,
      googleId: options.googleId,
    };

    const user = new UserInstance(this.mongoClient, this.log, data);
    await user.save();
    return user;
  }

  async getUser(id: string): Promise<User | undefined> {
    const data = await this.users.findOne({ _id: id.trim() });
    if (data) {
      return new UserInstance(this.mongoClient, this.log, data);
    }

    return undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const lowered = email.trim().toLocaleLowerCase();
    const data = await this.users.findOne({ emailLowered: lowered });
    if (data) {
      return new UserInstance(this.mongoClient, this.log, data);
    }

    return undefined;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const data = await this.users.findOne({ googleId: googleId.trim() });
    if (data) {
      return new UserInstance(this.mongoClient, this.log, data);
    }

    return undefined;
  }
}
