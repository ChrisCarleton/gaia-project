import 'dotenv/config';

export class Config {
  static get LogLevel(): string {
    return process.env.GP_LOG_LEVEL ?? 'info';
  }
}
