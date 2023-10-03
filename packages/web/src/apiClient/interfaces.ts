import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { PlayerDTO } from '@gaia-project/api';

export interface User {
  readonly id: string;
  readonly email: string;
  readonly memberSince: Date;
  avatar?: string;
  displayName?: string;
  changeEmail(newEmail: string): Promise<void>;
  save(): Promise<void>;
}

export interface UserManager {
  getCurrentUser(): Promise<User | undefined>;
}

export interface Lobby {
  readonly id: string;
  readonly ownerId: string;
  readonly players: Readonly<PlayerDTO[]>;
}

export interface LobbyManager {
  createLobby(): Promise<Lobby>;
  getLobby(lobbyId: string): Promise<Lobby>;
}

export interface ApiClient {
  readonly users: UserManager;
  readonly lobbies: LobbyManager;
}

export type GqlClient = ApolloClient<NormalizedCacheObject>;
