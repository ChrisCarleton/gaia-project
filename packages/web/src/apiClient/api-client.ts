import { SuperAgentStatic } from 'superagent';

import { ApiClient, UserManager } from './interfaces';
import { UserManagerInstance } from './user-manager';

export class ApiClientInstance implements ApiClient {
  readonly users: UserManager;

  constructor(agent: SuperAgentStatic) {
    this.users = new UserManagerInstance(agent);
  }
}
