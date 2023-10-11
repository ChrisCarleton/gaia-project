import { Maybe } from '@/utils';
import {
  ApolloClient as ApolloClientInternal,
  NormalizedCacheObject,
} from '@apollo/client/core';
import { OperationVariables, TypedDocumentNode } from '@apollo/client/core';
import { FactionType } from '@gaia-project/engine';

export interface GqlClient {
  query<TResult, TVars extends OperationVariables = object>(
    query: TypedDocumentNode<TResult, TVars>,
    variables?: TVars,
  ): Promise<TResult>;

  mutate<TResult = void, TVars extends OperationVariables = object>(
    query: TypedDocumentNode<TResult, TVars>,
    variables?: TVars,
  ): Promise<TResult>;
}

export interface User {
  readonly id: string;
  readonly email: string;
  readonly memberSince: Date;
  avatar: string | null;
  displayName: string;
  changeEmail(newEmail: string): Promise<void>;
  save(): Promise<void>;
}

export interface UserManager {
  getCurrentUser(): Promise<User | null>;
}

export interface LobbyPlayer {
  readonly id: string;
  readonly avatar: Maybe<string>;
  readonly displayName: string;
  readonly memberSince: Date;
  faction: Maybe<FactionType>;

  save(): Promise<void>;
  disconnect(): Promise<void>;
}

export interface Lobby {
  readonly id: string;
  readonly ownerId: string;
  readonly players: Readonly<LobbyPlayer[]>;

  join(): Promise<LobbyPlayer>;
  leave(): Promise<void>;
}

export interface LobbyManager {
  createLobby(): Promise<Lobby>;
  getLobby(lobbyId: string): Promise<Lobby | null>;
}

export interface ApiClient {
  readonly users: UserManager;
  readonly lobbies: LobbyManager;
}

export type ApolloClient = ApolloClientInternal<NormalizedCacheObject>;
