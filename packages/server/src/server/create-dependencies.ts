import Logger from 'bunyan';
import { Express } from 'express';
import { Server, createServer } from 'http';
import { MongoClient } from 'mongodb';

import config from '../config';
import { LobbyManager, LobbyManagerInstance } from '../games';
import { UserManager, UserManagerInstance } from '../users';
import { GameServer, WSGameClient, WSGameServer } from './ws';
import { RedisPubSubService } from './ws/redis-pubsub-service';

export interface ServerDependencies {
  createHttpServer: (app: Express) => Server;
  lobbyManager: LobbyManager;
  logger: Logger;
  mongoClient: MongoClient;
  userManager: UserManager;
  gameServer: GameServer;
}

export async function createDependencies(
  logger: Logger,
): Promise<ServerDependencies> {
  const mongoClient = await MongoClient.connect(config.mongoUri);
  const userManager = new UserManagerInstance(mongoClient, logger);
  const lobbyManager = new LobbyManagerInstance(mongoClient, logger);

  const pubSub = new RedisPubSubService();
  const gameServer = new WSGameServer(
    userManager,
    lobbyManager,
    pubSub,
    logger,
  );

  return {
    createHttpServer: createServer,
    gameServer,
    lobbyManager,
    logger,
    mongoClient,
    userManager,
  };
}
