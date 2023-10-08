import { Maybe } from '@/utils';
import { LobbyPlayerDto } from '@gaia-project/api';
import { FactionType } from '@gaia-project/engine';

import { GqlClient, LobbyPlayer } from './interfaces';

export class LobbyPlayerInstance implements LobbyPlayer {
  constructor(
    private readonly client: GqlClient,
    private readonly dto: LobbyPlayerDto,
  ) {}

  get id(): string {
    return this.dto.user.id;
  }

  get avatar(): Maybe<string> {
    return this.dto.user.avatar;
  }

  get displayName(): string {
    return this.dto.user.displayName;
  }

  get memberSince(): Date {
    return this.dto.user.memberSince;
  }

  get faction(): Maybe<FactionType> {
    return this.dto.faction;
  }

  async save(): Promise<void> {}

  async disconnect(): Promise<void> {}
}
