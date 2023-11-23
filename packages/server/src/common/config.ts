import 'dotenv/config';

export class Config {
  private static tryParseNumber(
    value: string | undefined,
    defaultValue: number,
  ): number {
    if (!value) return defaultValue;
    const parsed = parseInt(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  static get environment(): string {
    return process.env.NODE_ENV ?? 'dev';
  }

  static get isProduction(): boolean {
    return Config.environment === 'production';
  }

  static get logLevel(): string {
    return process.env.GP_LOG_LEVEL ?? 'info';
  }

  static get mongoUri(): string {
    return (
      process.env.GP_MONGODB_URI ??
      'mongodb://localhost:27017/gaia-project-local'
    );
  }

  static get port(): number {
    return Config.tryParseNumber(process.env.GP_PORT, 3020);
  }
}
