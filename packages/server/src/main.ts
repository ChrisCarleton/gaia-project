import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './global-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapterHost));

  await app.listen(3000);
}

bootstrap()
  .then(() => {
    // TODO: App has started. Log a message.
  })
  .catch((error) => {
    // TODO: App failed to initialize. Throw an error and kill the process.
    process.exit(1);
  });
