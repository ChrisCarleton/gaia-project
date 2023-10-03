import { LobbyDTOSchema } from '@gaia-project/api';

import { GqlClient, Lobby, LobbyManager } from './interfaces';
import { LobbyInstance } from './lobby';

export class LobbyManagerInstance implements LobbyManager {
  constructor(private readonly client: GqlClient) {}

  async createLobby(): Promise<Lobby> {
    throw new Error('Nope');
  }

  async getLobby(lobbyId: string): Promise<Lobby> {
    throw new Error('Nope');
  }
}
