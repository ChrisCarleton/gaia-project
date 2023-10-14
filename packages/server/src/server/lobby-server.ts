import { WsConnectionParams } from '@gaia-project/api';
import Logger from 'bunyan';
import { ExecutionArgs, GraphQLError, GraphQLSchema } from 'graphql';
import { Context } from 'graphql-ws';
import {
  Disposable,
  ErrorMessage,
  SubscribeMessage,
} from 'graphql-ws/lib/common';
import { useServer } from 'graphql-ws/lib/use/ws';
import { WebSocketServer } from 'ws';

import { Lobby, LobbyManager, LobbyPlayer } from '../games';
import { UserManager } from '../users';

type ContextExtras = {
  lobby: Lobby | null;
  player: LobbyPlayer | null;
};

type ServerContext = Context<WsConnectionParams, Partial<ContextExtras>>;

export type LobbyServerOptions = {
  lobbies: LobbyManager;
  log: Logger;
  schema: GraphQLSchema;
  users: UserManager;
  wsServer: WebSocketServer;
};

export class LobbyServer implements Disposable {
  private readonly log: Logger;
  private readonly users: UserManager;
  private readonly lobbies: LobbyManager;
  private readonly disposable: Disposable;

  constructor({ log, users, lobbies, wsServer, schema }: LobbyServerOptions) {
    this.log = log;
    this.users = users;
    this.lobbies = lobbies;
    this.disposable = useServer<WsConnectionParams, ContextExtras>(
      {
        schema,
        onConnect: this.onConnection.bind(this),
        onDisconnect: this.onDisconnection.bind(this),
        onError: this.onError.bind(this),
        context: this.createContext.bind(this),
      },
      wsServer,
    );
  }

  async dispose(): Promise<void> {
    await this.disposable.dispose();
  }

  private async createContext(
    ctx: ServerContext,
    message: SubscribeMessage,
    args: ExecutionArgs,
  ): Promise<ServerContext> {
    this.log.debug('[LOBBY] Creating context for new connection', {
      ctx,
      message,
      args,
    });
    return ctx;
  }

  private async onConnection(ctx: ServerContext): Promise<void> {
    this.log.debug('[LOBBY] New connection attempt', ctx);
  }

  private async onDisconnection(
    ctx: ServerContext,
    code: number,
    reason: string,
  ): Promise<void> {
    this.log.debug('[LOBBY] Disconnection detected.', {
      context: ctx,
      code,
      reason,
    });
  }

  private async onError(
    ctx: ServerContext,
    message: ErrorMessage,
    errors: Readonly<GraphQLError[]>,
  ): Promise<Readonly<GraphQLError[]>> {
    this.log.error('[LOBBY] Error!', message, errors);
    return errors;
  }
}
