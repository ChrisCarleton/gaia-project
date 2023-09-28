import { LobbyDTO, PlayerDTO } from '@gaia-project/api';
import { SuperAgentStatic } from 'superagent';

import { Lobby } from './interfaces';

export class LobbyInstance implements Lobby {
  constructor(
    private readonly agent: SuperAgentStatic,
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
