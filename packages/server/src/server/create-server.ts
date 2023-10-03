import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import userAgent from 'express-useragent';
import { v4 as uuid } from 'uuid';

import config from '../config';
import { configureAuth } from './auth';
import { ServerDependencies } from './create-dependencies';
import { createGraphqlServer } from './graphql';
import { configureRouter } from './routes';

export async function createServer(
  createDependencies: () => Promise<ServerDependencies>,
): Promise<Express> {
  const { createHttpServer, lobbyManager, logger, userManager } =
    await createDependencies();
  const app = express();
  const httpServer = createHttpServer(app);

  logger.debug('[APP] Initializing body, cookie, and user agent parsing...');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(userAgent.express());

  logger.debug('[APP] Configuring CORS support...');
  app.use(
    cors({
      origin: (_origin, cb) => {
        cb(null, true);
      },
      credentials: true,
    }),
  );

  logger.debug('[APP] Adding middleware to initialize request context...');
  app.use((req, _res, next) => {
    req.log = logger;
    req.users = userManager;
    req.lobbies = lobbyManager;
    next();
  });

  logger.debug('[APP] Initializing Passport.js and adding auth routes...');
  configureAuth(app);

  // Add middleware to do debug-level logging of all requests as well as create a child logger with
  // request metadata attached.
  app.use((req, _res, next) => {
    req.log = req.log.child({
      requestId: uuid(),
      method: req.method,
      path: req.path,
      userAgent: req.useragent?.source,
      ...(req.user ? { user: { id: req.user.id, email: req.user.email } } : {}),
    });

    if (req.log.debug()) {
      req.log.debug('Request received');
    }

    next();
  });

  logger.debug('[APP] Registering REST auth API routes...');
  configureRouter(app);

  logger.debug('[APP] Starting GraphQL server...');
  const graphqlServer = await createGraphqlServer(httpServer);
  await graphqlServer.start();
  app.use(
    '/api',
    expressMiddleware(graphqlServer, {
      context: async ({ req }) => req,
    }),
  );

  logger.debug('[APP] Starting HTTP server...');
  httpServer.listen(config.port);

  return app;
}
