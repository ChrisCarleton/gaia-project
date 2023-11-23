import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import Bunyan from 'bunyan';

import { AppModule } from './app.module';
import { BunyanLogger, Config, createLogger } from './common';
import {
  GenericExceptionFilter,
  HttpExceptionFilter,
  ValidationExceptionFilter,
} from './global-exception-filter';

const logger = createLogger();

async function bootstrap(logger: Bunyan) {
  const logService = new BunyanLogger(logger);

  const app = await NestFactory.create(AppModule, {
    logger: logService,
  });

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new HttpExceptionFilter(logService, httpAdapterHost),
    new ValidationExceptionFilter(logService, httpAdapterHost),
    new GenericExceptionFilter(logService, httpAdapterHost),
  );

  await app.listen(Config.port);
}

bootstrap(logger)
  .then(() => {
    logger.info(
      `🎉 Application has started and is listening on port ${Config.port} 🎉`,
    );
  })
  .catch((error) => {
    logger.fatal('Application failed to start. Halting process.', error);
    process.exit(1);
  });
