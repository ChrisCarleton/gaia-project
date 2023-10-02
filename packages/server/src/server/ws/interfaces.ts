import { FactionType } from '@gaia-project/engine';
import { IncomingMessage } from 'http';
import { Duplex } from 'stream';

export enum MessageType {
  Error = 'error',
  StateChange = 'state',
  PlayerCommand = 'command',
}

export enum PlayerCommand {
  SelectFaction = 'selectFaction',
}

export enum StateChangeCode {
  playerConnect = 'connection',
  playerDisconnect = 'disconnect',
}

export type MessageHeader = {
  fromServer: string;
  lobby?: string;
  user?: string;
};

export type ErrorMessage = {
  type: MessageType.Error;
  code: string;
  message: string;
};

export type PlayerConnectStateUpdateMessage = {
  type: MessageType.StateChange;
  code: StateChangeCode.playerConnect;
  connection: {
    lobby: string;
    user: string;
  };
};

export type StateUpdateMessage = PlayerConnectStateUpdateMessage;

export type PlayerCommandSelectFaction = {
  command: PlayerCommand.SelectFaction;
  faction: FactionType | null;
};

export type PlayerCommandMessage = {
  type: MessageType.PlayerCommand;
} & PlayerCommandSelectFaction;

export type MessagePayload =
  | PlayerCommandMessage
  | ErrorMessage
  | StateUpdateMessage;
export type Message = MessageHeader & MessagePayload;

export interface GameClient {
  readonly id: string;
  readonly lobbyId: string;
  readonly userId: string;
  readonly player: string;

  on(e: 'message', cb: (msg: PlayerCommandMessage) => void): void;
  on(e: 'error', cb: (error: Error) => void): void;
  on(e: 'disconnect', cb: () => void): void;
  on(e: string, cb: (...args: unknown[]) => void): void;

  drop(): Promise<void>;
}

export interface PubSubService {
  /**
   * Broadcasts a message to all subscribers.
   * @param message The message to send.
   */
  send(message: Message): Promise<void>;

  /**
   * Subscribes to receive notifications on when a message was broadcast by another server.
   * @param e The event to subscribe to.
   * @param cb A callback function to handle the receipt of the message.
   */
  on(e: 'message', cb: (msg: Message) => void): Promise<void>;

  /**
   * Closes and cleans up the underlying PubSub service. (The service will not be useable after this!)
   */
  close(): Promise<void>;
}

export interface GameServer {
  readonly id: string;

  close(): Promise<void>;
  connect(
    req: IncomingMessage,
    socket: Duplex,
    head: Buffer,
  ): Promise<GameClient>;
}
