import { LobbyDto, Operations } from '@gaia-project/api';

import { GqlClient, Lobby, LobbyPlayer } from './interfaces';
import { LobbyPlayerInstance } from './lobby-player';

export class LobbyInstance implements Lobby {
  constructor(
    private readonly client: GqlClient,
    private dto: LobbyDto,
  ) {}

  get id(): string {
    return this.dto.id;
  }

  get ownerId(): string {
    return this.dto.owner.id;
  }

  get players(): Readonly<LobbyPlayer[]> {
    return this.dto.players.map(
      (dto) => new LobbyPlayerInstance(this.client, dto),
    );
  }

  async join(): Promise<LobbyPlayer> {
    const { lobbiesJoinLobby: player } = await this.client.mutate(
      Operations.JoinLobbyDocument,
      {
        lobbyId: this.id,
      },
    );

    return new LobbyPlayerInstance(this.client, player);
  }

  async leave(): Promise<void> {
    await this.client.mutate(Operations.LeaveLobbyDocument, {
      lobbyId: this.id,
    });
  }
}
