import 'dotenv/config';

const ThreeDaysInSeconds = 60 * 60 * 24 * 3;

class GoogleConfig {
  get clientId(): string {
    return process.env.GP_GOOGLE_CLIENT_ID ?? '';
  }

  get clientSecret(): string {
    return process.env.GP_GOOGLE_CLIENT_SECRET ?? '';
  }
}

class AppConfig {
  readonly google = new GoogleConfig();

  get baseUrl(): string {
    return process.env.GP_BASE_URL ?? 'http://localhost:3020/';
  }

  get cookieName(): string {
    return process.env.GP_COOKIE_NAME ?? `gaia-project.${this.env}`;
  }

  get env(): string {
    return process.env.NODE_ENV ?? 'local';
  }

  get isProduction(): boolean {
    return this.env === 'production';
  }

  get logLevel(): string {
    return process.env.GP_LOG_LEVEL ?? 'debug';
  }

  get mongoUri(): string {
    return (
      process.env.GP_MONGO_URI ?? 'mongodb://localhost:27017/gaia-project-local'
    );
  }

  get port(): number {
    const parsed = parseInt(process.env.GP_PORT ?? '');
    return isNaN(parsed) ? 3020 : parsed;
  }

  get sessionSecret(): string {
    return process.env.GP_SESSION_SECRET ?? 'okey-dokey!';
  }

  get sessionTTLInSeconds(): number {
    const parsed = parseInt(process.env.GP_SESSION_TTL ?? '');
    return isNaN(parsed) || parsed <= 0 ? ThreeDaysInSeconds : parsed;
  }
}

export default new AppConfig();
