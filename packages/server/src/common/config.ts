import 'dotenv/config';

export type GoogleConfig = {
  clientId: string;
  clientSecret: string;
};

export class Config {
  private static tryParseNumber(
    value: string | undefined,
    defaultValue: number,
  ): number {
    if (!value) return defaultValue;
    const parsed = parseInt(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  static get baseUrl(): string {
    return process.env.GP_BASE_URL ?? 'http://localhost:3021/';
  }

  static get cookieName(): string {
    return process.env.GP_COOKIE_NAME ?? 'gaia-project.dev';
  }

  static get environment(): string {
    return process.env.NODE_ENV ?? 'dev';
  }

  static get google(): Readonly<GoogleConfig> {
    return {
      clientId: process.env.GP_GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GP_GOOGLE_CLIENT_SECRET ?? '',
    };
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

  static get sessionSecret(): string {
    return process.env.GP_SESSION_SECRET ?? 'shhhhh!!~secret';
  }
}
