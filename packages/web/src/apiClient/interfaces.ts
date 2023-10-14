import { Maybe } from '@/utils';
import {
  ApolloClient as ApolloClientInternal,
  NormalizedCacheObject,
} from '@apollo/client/core';
import { OperationVariables, TypedDocumentNode } from '@apollo/client/core';
import { LobbyDto } from '@gaia-project/api';
import { FactionType } from '@gaia-project/engine';
import { GraphQLError } from 'graphql';

export type SubscriptionOptions<TData, TVars> = {
  subscription: TypedDocumentNode<TData, TVars>;
  variables?: TVars;
  onData: (udpate: TData) => void;
  onError: (errors: Error | Readonly<GraphQLError[]>) => void;
  onClosed: () => void;
};

export interface GqlConnection {
  disconnect(): void;
}

export interface GqlClient {
  query<TResult, TVars extends OperationVariables = object>(
    query: TypedDocumentNode<TResult, TVars>,
    variables?: TVars,
  ): Promise<TResult>;

  mutate<TResult = void, TVars extends OperationVariables = object>(
    query: TypedDocumentNode<TResult, TVars>,
    variables?: TVars,
  ): Promise<TResult>;

  subscribe<TData, TVars extends OperationVariables = object>(
    options: SubscriptionOptions<TData, TVars>,
  ): Promise<GqlConnection>;
}

export interface User {
  readonly id: string;
  readonly email: string;
  readonly memberSince: Date;
  readonly authToken: Maybe<string>;
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

export type ConnectToLobbyOptions = {
  onUpdate: (update: LobbyDto) => void;
  onError: (errors: Error | Readonly<GraphQLError[]>) => void;
  onClose: () => void;
};

export interface Lobby {
  readonly id: string;
  readonly ownerId: string;
  readonly players: Readonly<LobbyPlayer[]>;

  connect(options: ConnectToLobbyOptions): Promise<GqlConnection>;
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
