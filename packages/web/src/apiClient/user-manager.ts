import { CurrentUserDTOSchema } from '@gaia-project/api';
import { SuperAgentStatic } from 'superagent';

import { User, UserManager } from './interfaces';
import { UserInstance } from './user';

export class UserManagerInstance implements UserManager {
  constructor(private readonly agent: SuperAgentStatic) {}

  async getCurrentUser(): Promise<User | undefined> {
    const { body } = await this.agent.get(`/api/auth/me`);
    const currentUser = CurrentUserDTOSchema.parse(body);

    if (!currentUser.anonymous) {
      return new UserInstance(this.agent, currentUser);
    }

    return undefined;
  }
}
