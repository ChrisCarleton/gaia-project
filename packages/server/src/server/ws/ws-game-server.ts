import Logger from 'bunyan';
import { IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';
import { Duplex } from 'stream';
import { v4 as uuid } from 'uuid';
import { WebSocket, WebSocketServer } from 'ws';
import { z } from 'zod';

import config from '../../config';
import { UnauthorizedError } from '../../errors';
import { LobbyManager } from '../../games';
import { UserManager } from '../../users';
import {
  GameClient,
  GameServer,
  Message,
  MessageType,
  PubSubService,
  StateChangeCode,
} from './interfaces';
import { WSGameClient } from './ws-game-client';

const JwtSubjectSchema = z.object({
  lobby: z.string(),
  user: z.string().uuid(),
});
type JwtSubject = z.infer<typeof JwtSubjectSchema>;

export class WSGameServer implements GameServer {
  private readonly server: WebSocketServer;
  private readonly clientsByLobby: Record<string, Record<string, GameClient>>;
  private readonly serverId: string;

  constructor(
    private readonly users: UserManager,
    private readonly lobbies: LobbyManager,
    private readonly pubSub: PubSubService,
    private readonly log: Logger,
  ) {
    this.server = new WebSocketServer({ noServer: true });
    this.clientsByLobby = {};
    this.serverId = uuid();
    this.pubSub.on('message', this.onPubSubBroadcast.bind(this));
  }

  get id(): string {
    return this.serverId;
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  async connect(
    req: IncomingMessage,
    socket: Duplex,
    head: Buffer,
  ): Promise<GameClient> {
    const [webSocket, request] = await new Promise<
      [WebSocket, IncomingMessage]
    >((resolve) => {
      this.server.handleUpgrade(req, socket, head, (webSocket, request) => {
        resolve([webSocket, request]);
      });
    });

    const { lobby: lobbyId, user: userId } =
      await this.validateConnection(request);
    const [lobby, user] = await Promise.all([
      this.lobbies.getLobby(lobbyId),
      this.users.getUser(userId),
    ]);

    if (!user) throw new UnauthorizedError(`User with ID ${userId} not found.`);
    if (!lobby)
      throw new UnauthorizedError(`Lobby with ID ${lobbyId} not found.`);

    const client = new WSGameClient(this.log, webSocket, lobby, user);
    return client;
  }

  private async validateConnection(req: IncomingMessage): Promise<JwtSubject> {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedError('Authorization header is missing');
    }

    if (!/^Bearer .+/i.test(authHeader)) {
      throw new UnauthorizedError(
        'Bearer token not found in Authorization header.',
      );
    }

    const token = authHeader.substring(7).trim();
    return await new Promise<JwtSubject>((resolve, reject) => {
      jwt.verify(token, config.sessionSecret, (error, payload) => {
        if (error) return reject(error);

        if (!payload || typeof payload === 'string') {
          throw new UnauthorizedError('JWT payload is invalid.');
        }

        const parseResult = JwtSubjectSchema.safeParse(payload.sub);
        if (!parseResult.success) {
          throw new UnauthorizedError('JWT subject is invalid.');
        }

        resolve(parseResult.data);
      });
    });
  }

  private async registerClient(client: GameClient): Promise<void> {
    if (!this.clientsByLobby[client.lobbyId]) {
      this.clientsByLobby[client.lobbyId] = {};
    }

    if (this.clientsByLobby[client.lobbyId][client.userId]) {
      // TODO: Wat!? User is already in the lobby!!?!?
    }

    this.clientsByLobby[client.lobbyId][client.userId] = client;

    // Publish the new user registration. We don't want the same user
    // connected to two servers... for now?
    await this.pubSub.send({
      fromServer: this.id,
      type: MessageType.StateChange,
      code: StateChangeCode.playerConnect,
      connection: {
        lobby: client.lobbyId,
        user: client.userId,
      },
    });
  }

  private getRegisteredClient(
    lobbyId: string,
    userId: string,
  ): GameClient | null {
    const lobbyClients = this.clientsByLobby[lobbyId];
    if (!lobbyClients) return null;

    const client = lobbyClients[userId];
    return client ?? null;
  }

  private onPubSubBroadcast(msg: Message): void {
    // Ignore messages that originated from this server.
    if (msg.fromServer === this.id) return;

    // TODO: Watch for users connecting on multiple servers. Drop their connection if they connect somewhere else.

    // TODO: Route the message to the appropriate handler.
  }
}
