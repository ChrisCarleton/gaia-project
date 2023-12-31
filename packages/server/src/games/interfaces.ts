import { LobbyDto, LobbyPlayerDto } from '@gaia-project/api';
import { FactionType } from '@gaia-project/engine';

import { User } from '../users';

export interface LobbyPlayer {
  readonly id: string;
  faction: FactionType | null;
  user(): Promise<User>;

  toJSON(): LobbyPlayerDto;
}

export type LobbyData = Omit<LobbyDto, 'joinToken'>;
export interface Lobby {
  readonly id: string;
  readonly createdOn: Date;
  readonly updatedOn: Date;
  owner(): Promise<User>;

  readonly players: Readonly<LobbyPlayer[]>;
  join(user: User): Promise<LobbyPlayer>;
  leave(user: User): Promise<LobbyPlayer | null>;

  delete(): Promise<boolean>;
  save(): Promise<void>;

  toJSON(): LobbyData;
}

export interface LobbyManager {
  createLobby(owner: User): Promise<Lobby>;
  deleteLobby(lobbyId: string): Promise<boolean>;
  getLobby(lobbyId: string): Promise<Lobby | null>;
}
