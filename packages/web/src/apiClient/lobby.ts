import { LobbyDto } from '@gaia-project/api';
import { JoinLobbyDocument } from '@gaia-project/api/src/generated/operations';
import { EventEmitter } from 'events';

import {
  ConnectToLobbyOptions,
  GqlClient,
  GqlConnection,
  Lobby,
  LobbyPlayer,
} from './interfaces';
import { LobbyPlayerInstance } from './lobby-player';

export class LobbyInstance implements Lobby {
  private connection: GqlConnection | undefined;
  private readonly emitter: EventEmitter;

  constructor(
    private readonly client: GqlClient,
    private dto: LobbyDto,
  ) {
    this.emitter = new EventEmitter();
  }

  async connect(options: ConnectToLobbyOptions): Promise<GqlConnection> {
    if (this.connection) {
      return this.connection;
    }

    this.connection = await this.client.subscribe({
      subscription: JoinLobbyDocument,
      variables: { lobbyId: this.id },
      onData: (update) => {
        this.emitter.emit('update', update.lobbiesJoin);
        update.lobbiesJoin;
      },
      onError: (error) => {
        this.emitter.emit('error', error);
      },
      onClosed: () => {
        this.emitter.emit('disconnect');
        this.emitter.removeAllListeners();
        this.connection = undefined;
      },
    });

    this.emitter.addListener('update', options.onUpdate);
    this.emitter.addListener('error', options.onError);
    this.emitter.addListener('disconnect', options.onClose);

    return this.connection;
  }

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
