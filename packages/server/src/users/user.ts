import { UserDTO } from '@gaia-project/api';
import { Logger } from '@nestjs/common';

import { UserDocument } from '../data';

export class User {
  private readonly log = new Logger(User.name);

  constructor(private readonly data: UserDocument) {}

  get avatar(): string | undefined {
    return this.data.avatar;
  }
  set avatar(value: string | undefined) {
    this.data.avatar = value;
  }

  get displayName(): string {
    return this.data.displayName;
  }
  set displayName(value: string) {
    this.data.displayName = value.trim();
  }

  get email(): string {
    return this.data.email;
  }

  get id(): string {
    return this.data._id;
  }

  get memberSince(): Date {
    return this.data.memberSince;
  }

  async save(): Promise<void> {
    this.log.debug(
      `Attempting to save changes to user account with ID ${this.data._id}...`,
    );
    await this.data.save();
  }

  toDTO(): UserDTO {
    return {
      avatar: this.data.avatar,
      displayName: this.data.displayName,
      email: this.data.email,
      id: this.data._id,
      memberSince: this.data.memberSince,
    };
  }
}
