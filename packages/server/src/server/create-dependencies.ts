import Logger from 'bunyan';
import { MongoClient } from 'mongodb';

import config from '../config';
import { UserManager, UserManagerInstance } from '../users';

export interface ServerDependencies {
  logger: Logger;
  mongoClient: MongoClient;
  userManager: UserManager;
}

export async function createDependencies(
  logger: Logger,
): Promise<ServerDependencies> {
  const mongoClient = await MongoClient.connect(config.mongoUri);
  const userManager = new UserManagerInstance(mongoClient, logger);
  return {
    logger,
    mongoClient,
    userManager,
  };
}
