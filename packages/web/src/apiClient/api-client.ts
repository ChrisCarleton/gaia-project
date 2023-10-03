import { GqlClient } from './interfaces';
import { ApiClient, LobbyManager, UserManager } from './interfaces';
import { LobbyManagerInstance } from './lobby-manager';
import { UserManagerInstance } from './user-manager';

export class ApiClientInstance implements ApiClient {
  readonly users: UserManager;
  readonly lobbies: LobbyManager;

  constructor(gqlClient: GqlClient) {
    this.users = new UserManagerInstance(gqlClient);
    this.lobbies = new LobbyManagerInstance(gqlClient);
  }
}
