import { LobbyDto } from '@gaia-project/api';

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
}
