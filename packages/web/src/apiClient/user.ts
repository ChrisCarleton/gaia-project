import { UserDto } from '@gaia-project/api';

import { GqlClient, User } from './interfaces';

export class UserInstance implements User {
  constructor(
    private readonly client: GqlClient,
    private data: UserDto,
  ) {}

  async changeEmail(newEmail: string): Promise<void> {}

  async save(): Promise<void> {}

  get avatar(): string | undefined {
    return this.data.avatar?.valueOf();
  }
  set avatar(value: string | undefined) {
    this.data.avatar = value;
  }

  get displayName(): string | undefined {
    return this.data.displayName;
  }
  set displayName(value: string) {
    this.data.displayName = value;
  }

  get id(): string {
    return this.data.id;
  }

  get email(): string {
    return this.data.email;
  }

  get memberSince(): Date {
    return this.data.memberSince;
  }
}
