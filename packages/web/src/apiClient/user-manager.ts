import { CurrentUserDto } from '@gaia-project/api';
import gql from 'graphql-tag';

import { GqlClient, User, UserManager } from './interfaces';
import { UserInstance } from './user';

export class UserManagerInstance implements UserManager {
  private static readonly GetCurrentUserQuery = gql``;
  constructor(private readonly gqlClient: GqlClient) {}

  async getCurrentUser(): Promise<User | undefined> {
    const { data, errors } = await this.gqlClient.query<CurrentUserDto>({
      query: UserManagerInstance.GetCurrentUserQuery,
    });

    if (data.anonymous) return undefined;

    return new UserInstance(this.gqlClient, data.user!);
  }
}
