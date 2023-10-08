import { Operations } from '@gaia-project/api';

import { GqlClient, Lobby, LobbyManager } from './interfaces';
import { LobbyInstance } from './lobby';

export class LobbyManagerInstance implements LobbyManager {
  constructor(private readonly client: GqlClient) {}

  async createLobby(): Promise<Lobby> {
    const { lobbiesCreateLobby: data } = await this.client.mutate(
      Operations.CreateLobbyDocument,
    );
    return new LobbyInstance(this.client, data);
  }

  async getLobby(lobbyId: string): Promise<Lobby | null> {
    const { lobbiesGetLobby: data } = await this.client.query(
      Operations.GetLobbyDocument,
      {
        lobbyId,
      },
    );

    return data ? new LobbyInstance(this.client, data) : null;
  }
}
