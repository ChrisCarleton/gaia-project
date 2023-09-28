import { Express } from 'express';

import { configureAuthRoutes } from './auth';
import { configureErrorHandlerRoutes } from './errors';
import { configureGamesRoutes } from './games';
import { configureHealthCheckRoute } from './health';
import { configureUserRoutes } from './users';

export function configureRouter(app: Express) {
  configureAuthRoutes(app);
  configureUserRoutes(app);
  configureHealthCheckRoute(app);
  configureGamesRoutes(app);

  // Error handlers need to be added last to work correctly!!
  configureErrorHandlerRoutes(app);
}
