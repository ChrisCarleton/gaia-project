import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { DateScalar, Resolvers, loadTypeDefs } from '@gaia-project/api';
import { Request } from 'express';
import { Server } from 'http';

import config from '../config';
import { UserQueries } from './resolvers';

export async function createGraphqlServer(
  httpServer: Server,
): Promise<ApolloServer<Request>> {
  const typeDefs = await loadTypeDefs();

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
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
}
