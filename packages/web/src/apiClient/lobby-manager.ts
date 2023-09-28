import { LobbyDTOSchema } from '@gaia-project/api';
import { SuperAgentStatic } from 'superagent';

import { Lobby, LobbyManager } from './interfaces';
import { LobbyInstance } from './lobby';

export class LobbyManagerInstance implements LobbyManager {
  constructor(private readonly agent: SuperAgentStatic) {}

  async createLobby(): Promise<Lobby> {
    const { body } = await this.agent.post('/api/lobby');
    const dto = LobbyDTOSchema.parse(body);
    return new LobbyInstance(this.agent, dto);
  }

  async getLobby(lobbyId: string): Promise<Lobby> {
    const { body } = await this.agent.get(`/api/lobby/${lobbyId}`);
    const dto = LobbyDTOSchema.parse(body);
    return new LobbyInstance(this.agent, dto);
  }
}
