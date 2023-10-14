import { Operations } from '@gaia-project/api';

import { GqlClient, User, UserManager } from './interfaces';
import { UserInstance } from './user';

export class UserManagerInstance implements UserManager {
  constructor(private readonly gqlClient: GqlClient) {}

  async getCurrentUser(): Promise<User | null> {
    const { usersGetCurrent: data } = await this.gqlClient.query(
      Operations.GetCurrentUserDocument,
    );
    return data.anonymous ? null : new UserInstance(this.gqlClient, data.user!);
  }
}
