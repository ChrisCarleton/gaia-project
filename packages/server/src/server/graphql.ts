import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { DateScalar, Resolvers, typeDefs } from '@gaia-project/api';
import { Request } from 'express';
import { Server } from 'http';

import config from '../config';
import { formatError } from '../errors';
import { UserQueries } from './resolvers';

export async function createGraphqlServer(
  httpServer: Server,
): Promise<ApolloServer<Request>> {
  const resolvers: Resolvers<Request> = {
    Date: DateScalar,
    Query: {
      ...UserQueries,
    },
  };

  return new ApolloServer<Request>({
    typeDefs,
    introspection: !config.isProduction,
    resolvers,
    formatError,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
}
