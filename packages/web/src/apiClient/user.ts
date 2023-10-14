import { Maybe } from '@/utils';
import { Operations, ProfileUpdateDto, UserDto } from '@gaia-project/api';

import { GqlClient, User } from './interfaces';

export class UserInstance implements User {
  constructor(
    private readonly client: GqlClient,
    private data: UserDto,
  ) {}

  async changeEmail(newEmail: string): Promise<void> {
    await this.client.mutate(Operations.UpdateEmailDocument, {
      userId: this.id,
      newEmail: newEmail,
    });
  }

  async save(): Promise<void> {
    const update: ProfileUpdateDto = {
      avatar: this.avatar,
      displayName: this.displayName,
    };

    await this.client.mutate(Operations.UpdateProfileDocument, { update });
  }

  get avatar(): string | null {
    return this.data.avatar ?? null;
  }
  set avatar(value: string | null) {
    this.data.avatar = value;
  }

  get displayName(): string {
    return this.data.displayName;
  }
  set displayName(value: string) {
    this.data.displayName = value;
  }

  get id(): string {
    return this.data.id;
  }

  get email(): string {
    return this.data.email ?? '';
  }

  get memberSince(): Date {
    return this.data.memberSince;
  }

  get authToken(): Maybe<string> {
    return this.data.authToken;
  }
}
