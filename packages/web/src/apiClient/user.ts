import { UserDTO } from '@gaia-project/api';
import { SuperAgentStatic } from 'superagent';

import { User } from './interfaces';

export class UserInstance implements User {
  constructor(
    private readonly agent: SuperAgentStatic,
    private readonly data: UserDTO,
  ) {}

  async changeEmail(newEmail: string): Promise<void> {}

  async save(): Promise<void> {}

  get avatar(): string | undefined {
    return this.data.avatar;
  }
  set avatar(value: string | undefined) {
    this.data.avatar = value;
  }

  get displayName(): string | undefined {
    return this.data.displayName;
  }
  set displayName(value: string | undefined) {
    this.data.displayName = value;
  }

  get id(): string {
    return this.data.id;
  }

  get email(): string {
    return this.data.email;
  }
}
