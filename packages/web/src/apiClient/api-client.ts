import { SuperAgentStatic } from 'superagent';

import { ApiClient, LobbyManager, UserManager } from './interfaces';
import { LobbyManagerInstance } from './lobby-manager';
import { UserManagerInstance } from './user-manager';

export class ApiClientInstance implements ApiClient {
  readonly users: UserManager;
  readonly lobbies: LobbyManager;

  constructor(agent: SuperAgentStatic) {
    this.users = new UserManagerInstance(agent);
    this.lobbies = new LobbyManagerInstance(agent);
  }
}
