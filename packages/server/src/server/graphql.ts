import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { DateScalar, Resolvers, typeDefs } from '@gaia-project/api';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { Request } from 'express';
import { Server } from 'http';
import { WebSocketServer } from 'ws';

import config from '../config';
import { formatError } from '../errors';
import { ServerDependencies } from './create-dependencies';
import { LobbyServer } from './lobby-server';
import {
  LobbyMutations,
  LobbyQueries,
  UserMutations,
  UserQueries,
  getLobbySubscriptions,
} from './resolvers';

export async function createGraphqlServer(
  httpServer: Server,
  { lobbyManager, logger, pubsub, userManager }: ServerDependencies,
): Promise<ApolloServer<Request>> {
  const resolvers: Resolvers<Request> = {
    Date: DateScalar,
    Query: {
      ...UserQueries,
      ...LobbyQueries,
    },
    Mutation: {
      ...UserMutations,
      ...LobbyMutations,
    },
    Subscription: {
      ...getLobbySubscriptions(pubsub),
    },
  };

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/api/ws',
  });

  const lobbyServer = new LobbyServer({
    log: logger,
    users: userManager,
    lobbies: lobbyManager,
    wsServer,
    schema,
  });

  return new ApolloServer<Request>({
    formatError,
    introspection: !config.isProduction,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await lobbyServer.dispose();
            },
          };
        },
      },
    ],
    schema,
  });
}
