import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { UserDocument } from '../data';
import { User } from './user';

export type CreateUserOptions = {
  email: string;
  displayName: string;
  avatar?: string;
  googleId?: string;
};

export type SearchUserOptions = {
  limit: number;
  skip: number;
};

export enum OAuthProvider {
  Google = 'google',
}

@Injectable()
export class UsersService {
  private readonly log = new Logger(UsersService.name);

  constructor(
    @InjectModel(UserDocument.name) private readonly users: Model<UserDocument>,
  ) {}

  async createUser(options: CreateUserOptions): Promise<User> {
    this.log.debug('Creating new user account...', options);

    const userData = new this.users({
      _id: uuid(),
      avatar: options.avatar,
      displayName: options.displayName,
      email: options.email,
      emailLowered: options.email.toLowerCase(),
      googleId: options.googleId,
      memberSince: new Date(),
    });
    await userData.save();

    this.log.log('New user account created', {
      id: userData._id,
      email: userData.email,
      displayName: userData.displayName,
    });

    return new User(userData);
  }

  async getUser(id: string): Promise<User | undefined> {
    this.log.debug(`Attempting to retrieve user account with id ${id}...`);
    const userData = await this.users.findById(id);

    if (userData) {
      return new User(userData);
    }

    return undefined;
  }

  async getUserByOAuthID(
    _provider: OAuthProvider,
    id: string,
  ): Promise<User | undefined> {
    this.log.debug(
      `Attempting to lookup user with Google profile ID "${id}"...`,
    );
    const userData = await this.users.findOne({ googleId: id });

    if (userData) {
      return new User(userData);
    }

    return undefined;
  }

  async searchUsers(options?: Partial<SearchUserOptions>): Promise<User[]> {
    return [];
  }
}
