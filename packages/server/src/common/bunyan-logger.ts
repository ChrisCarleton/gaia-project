import { LogLevel, LoggerService } from '@nestjs/common';
import Bunyan from 'bunyan';

export class BunyanLogger implements LoggerService {
  private readonly logger: Bunyan;

  constructor() {
    this.logger = Bunyan.createLogger({
      name: 'gaia-project',
      level: 'info',
    });
  }

  log(message: unknown, ...optionalParams: unknown[]) {
    this.logger.info(message, ...optionalParams);
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    this.logger.error(message, ...optionalParams);
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    this.logger.warn(message, ...optionalParams);
  }

  debug(message: unknown, ...optionalParams: unknown[]) {
    this.logger.debug(message, ...optionalParams);
  }

  verbose(message: unknown, ...optionalParams: unknown[]) {
    this.logger.trace(message, ...optionalParams);
  }

  fatal(message: unknown, ...optionalParams: unknown[]) {
    this.logger.fatal(message, ...optionalParams);
  }
}
