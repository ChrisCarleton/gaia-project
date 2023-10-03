import { LobbyDTO, PlayerDTO } from '@gaia-project/api';

import { GqlClient, Lobby } from './interfaces';

export class LobbyInstance implements Lobby {
  constructor(
    private readonly client: GqlClient,
    private dto: LobbyDTO,
  ) {}

  get id(): string {
    return this.dto.id;
  }

  get ownerId(): string {
    return this.dto.ownerId;
  }

  get players(): Readonly<PlayerDTO[]> {
    return this.dto.players;
  }
}
