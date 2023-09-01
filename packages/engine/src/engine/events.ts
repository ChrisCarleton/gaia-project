import { Player } from '../interfaces';

export enum EventType {
  PlayerJoined = 'playerJoined',
}

export type PlayerJoinedEventArgs = {
  type: EventType.PlayerJoined;
  player: Player;
}

export type EventArgs = PlayerJoinedEventArgs;
