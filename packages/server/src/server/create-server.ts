import bodyParser from 'body-parser';
import MongoStore from 'connect-mongo';
import express, { Express } from 'express';
import session from 'express-session';
import userAgent from 'express-useragent';
import { v4 as uuid } from 'uuid';

import config from '../config';
import { CollectionNames } from '../data';
import { configureAuth } from './auth';
import { ServerDependencies } from './create-dependencies';
import { configureRouter } from './routes';

export async function createServer(
  createDependencies: () => Promise<ServerDependencies>,
): Promise<Express> {
  const { logger, mongoClient, userManager } = await createDependencies();
  const app = express();

  logger.debug('[APP] Initializing body and user agent parsing...');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(userAgent.express());

  logger.debug('[APP] Adding middleware to initialize request context...');
  app.use((req, _res, next) => {
    req.log = logger;
    req.users = userManager;
    next();
  });

  logger.debug('[APP] Initializing MongDb session store...');
  app.use(
    session({
      secret: config.sessionSecret,
      name: config.cookieName,
      resave: false,
      rolling: true,
      saveUninitialized: false,
      store: MongoStore.create({
        client: mongoClient,
        collectionName: CollectionNames.Sessions,
        ttl: config.sessionTTLInSeconds,
      }),
      cookie: {
        domain: config.baseUrl,
        httpOnly: true,
        sameSite: true,
        secure: config.isProduction,
      },
    }),
  );

  logger.debug('[APP] Initializing Passport.js and adding auth routes...');
  configureAuth(app, userManager);

  // Add middleware to do debug-level logging of all requests as well as create a child logger with
  // request metadata attached.
  app.use((req, _res, next) => {
    req.log = req.log.child({
      requestId: uuid(),
      method: req.method,
      path: req.originalUrl,
      userAgent: req.useragent?.source,
      ...(req.user ? { user: { id: req.user.id, email: req.user.email } } : {}),
    });

    if (req.log.debug()) {
      req.log.debug('Request received');
    }

    next();
  });

  logger.debug('[APP] Registering API routes...');
  configureRouter(app);

  return app;
}
