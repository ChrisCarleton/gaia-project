import { UserDTO } from '@gaia-project/api';
import Logger from 'bunyan';
import { Collection, MongoClient } from 'mongodb';

import { EmailSchema } from '../constants';
import { CollectionNames, UserDocument, UserSchema } from '../data';
import { ConflictError } from '../errors';
import { assertValid } from '../utils';
import { User } from './interfaces';

export class UserInstance implements User {
  private readonly users: Collection<UserDocument>;

  constructor(
    mongoClient: MongoClient,
    private readonly log: Logger,
    private data: UserDocument,
  ) {
    this.users = mongoClient.db().collection(CollectionNames.Users);
  }

  get id(): string {
    return this.data._id;
  }

  get email(): string {
    return this.data.email;
  }

  get memberSince(): Date {
    return this.data.memberSince;
  }

  get displayName(): string | undefined {
    return this.data.displayName;
  }
  set displayName(value: string) {
    this.data.displayName = value;
  }

  get avatar(): string | undefined {
    return this.data.avatar;
  }
  set avatar(value: string | undefined) {
    this.data.avatar = value;
  }

  get googleId(): string | undefined {
    return this.data.googleId;
  }
  set googleId(value: string | undefined) {
    this.data.googleId = value;
  }

  async changeEmail(newEmail: string): Promise<void> {
    newEmail = assertValid(newEmail, EmailSchema);
    const emailLowered = newEmail.toLocaleLowerCase();

    if (this.log.debug()) {
      this.log.debug(
        `Attempting to change email address for user "${this.id}".`,
        {
          oldEmail: this.data.email,
          newEmail: this.data.email,
        },
      );
    }

    const conflict = await this.users.findOne({
      $and: [{ _id: { $ne: this.data._id } }, { emailLowered }],
    });

    if (conflict) {
      throw new ConflictError(
        `Email address ${newEmail} is already taken.`,
        'email',
      );
    }

    await this.users.updateOne(
      { _id: this.data._id },
      {
        email: newEmail,
        emailLowered,
      },
    );

    if (this.log.info()) {
      this.log.info(
        `User "${this.id}" changed their email address to "${newEmail}".`,
      );
    }
  }

  async save(): Promise<void> {
    this.data = assertValid(this.data, UserSchema);
    await this.users.updateOne(
      { _id: this.data._id },
      { $set: this.data },
      { upsert: true },
    );
  }

  toJSON(): UserDTO {
    return {
      avatar: this.avatar,
      displayName: this.displayName,
      id: this.id,
      email: this.email,
      memberSince: this.memberSince,
    };
  }
}
