import Logger, { LogLevelString } from 'bunyan';
import { z } from 'zod';

const validLogLevels = z.enum([
  'trace',
  'debug',
  'info',
  'warn',
  'error',
  'fatal',
]);

export function createLogger(logLevel: string): Logger {
  const { success } = validLogLevels.safeParse(logLevel);
  if (!success) {
    logLevel = 'debug';
  }

  const logger = Logger.createLogger({
    name: 'gaia-project',
    level: logLevel as LogLevelString,
  });

  return logger;
}
