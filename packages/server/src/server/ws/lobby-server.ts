import Logger, { EventEmitter } from 'bunyan';
import { v4 as uuid } from 'uuid';
import { WebSocket, WebSocketServer } from 'ws';

enum ClientEvent {
  Close = 'close',
}

export class ClientConnection {
  private readonly connectionId: string;
  private readonly eventEmitter: EventEmitter;

  constructor(
    private readonly log: Logger,
    private readonly socket: WebSocket,
  ) {
    this.connectionId = uuid();
    this.eventEmitter = new EventEmitter();
    socket.on('error', this.onError.bind(this));
    socket.on('close', this.onClose.bind(this));
  }

  get id(): string {
    return this.connectionId;
  }

  private onError(socket: WebSocket, err: Error) {
    if (this.log.error()) {
      this.log.error(err);
    }
  }

  private onClose(socket: WebSocket, code: number, reason: Buffer) {
    this.eventEmitter.emit(ClientEvent.Close, this);
  }

  on(e: 'close', cb: (connection: ClientConnection) => void) {
    this.eventEmitter.addListener(ClientEvent.Close, cb);
  }
}

export class LobbyServer {
  private readonly wsServer: WebSocketServer;
  private readonly clientConnections: ClientConnection[];

  constructor(private readonly log: Logger) {
    this.clientConnections = [];
    this.wsServer = new WebSocketServer({ noServer: true });

    this.wsServer.on('connection', this.onConnection.bind(this));
  }

  private onConnection(socket: WebSocket) {
    const connection = new ClientConnection(this.log, socket);
    this.clientConnections.push(connection);

    connection.on('close', this.onClientDisconnect.bind(this));
  }

  private onClientDisconnect(client: ClientConnection) {
    const index = this.clientConnections.findIndex((c) => c.id === client.id);
    if (index > -1) {
      this.clientConnections.splice(index, 1);
    }
  }

  get connections(): Readonly<ClientConnection[]> {
    return this.clientConnections;
  }

  on(e: 'connection') {}

  broadcast() {}
}
