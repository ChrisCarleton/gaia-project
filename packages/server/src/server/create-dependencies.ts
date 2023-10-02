import Logger from 'bunyan';
import { Express } from 'express';
import { Server, createServer } from 'http';
import { MongoClient } from 'mongodb';

import config from '../config';
import { LobbyManager, LobbyManagerInstance } from '../games';
import { UserManager, UserManagerInstance } from '../users';

export interface ServerDependencies {
  createHttpServer: (app: Express) => Server;
  lobbyManager: LobbyManager;
  logger: Logger;
  mongoClient: MongoClient;
  userManager: UserManager;
}

export async function createDependencies(
  logger: Logger,
): Promise<ServerDependencies> {
  const mongoClient = await MongoClient.connect(config.mongoUri);
  const userManager = new UserManagerInstance(mongoClient, logger);
  const lobbyManager = new LobbyManagerInstance(mongoClient, logger);

  return {
    createHttpServer: createServer,
    lobbyManager,
    logger,
    mongoClient,
    userManager,
  };
}
