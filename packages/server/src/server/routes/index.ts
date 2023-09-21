import { Express } from 'express';

import { configureAuthRoutes } from './auth';
import { configureErrorHandlerRoutes } from './errors';
import { configureHealthCheckRoute } from './health';

export function configureRouter(app: Express) {
  configureAuthRoutes(app);
  configureHealthCheckRoute(app);

  // Error handlers need to be added last to work correctly!!
  configureErrorHandlerRoutes(app);
}
