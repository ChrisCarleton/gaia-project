import config from './config';
import { createLogger } from './logger';
import { createServer } from './server';
import { createDependencies } from './server/create-dependencies';

const logger = createLogger(config.logLevel);

logger.debug('[APP] Starting application...');
createServer(() => createDependencies(logger))
  .then((app) => {
    app.listen(config.port);
    logger.info(`[APP] Application started. Listening on port ${config.port}`);
  })
  .catch((error) => {
    logger.fatal(error);
    process.exit(1);
  });
