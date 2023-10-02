import { PlayerCommandMessage } from '@gaia-project/api';
import { FactionType } from '@gaia-project/engine';
import Logger from 'bunyan';
import { v4 as uuid } from 'uuid';
import { WebSocket } from 'ws';

import { Lobby } from '../../games';
import { User } from '../../users';
import { GameClient } from './interfaces';

export class WSGameClient implements GameClient {
  readonly id: string;

  constructor(
    private readonly log: Logger,
    private readonly socket: WebSocket,
    private readonly lobby: Lobby,
    private readonly user: User,
  ) {
    this.id = uuid();
  }

  get lobbyId(): string {
    return this.lobby.id;
  }

  get userId(): string {
    return this.user.id;
  }

  player: string = '';
  on(e: 'message', cb: (msg: PlayerCommandMessage) => void): void;
  on(e: 'error', cb: (error: Error) => void): void;
  on(e: 'disconnect', cb: () => void): void;
  on(e: unknown, cb: unknown): void {
    throw new Error('Method not implemented.');
  }

  drop(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
