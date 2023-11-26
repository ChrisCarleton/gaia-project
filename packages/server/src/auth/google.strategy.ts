import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { URL } from 'url';

import { Config } from '../common';
import { OAuthProvider, UsersService } from '../users';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly log = new Logger(GoogleStrategy.name);

  constructor(private readonly users: UsersService) {
    super({
      clientID: Config.google.clientId,
      clientSecret: Config.google.clientSecret,
      callbackURL: new URL('/api/auth/google/callback', Config.baseUrl),
      scope: ['email', 'profile'],
      state: true,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    cb: VerifyCallback,
  ): Promise<void> {
    try {
      const { emails, id, name } = profile;

      let user = await this.users.getUserByOAuthID(OAuthProvider.Google, id);

      // Does the user already have an account?
      if (user) {
        cb(null, user);
        return;
      }

      // If not, attempt to create one.
      if (!emails || !emails[0] || !emails[0].verified) {
        cb(
          new UnauthorizedException(
            'User account does not have a verified email address.',
          ),
        );
        return;
      }

      user = await this.users.createUser({
        displayName: `${name?.givenName} ${name?.familyName}`,
        email: emails[0].value,
        avatar: profile.photos ? profile.photos[0].value : undefined,
        googleId: id,
      });

      cb(null, user);
    } catch (error) {
      if (error instanceof Error) cb(error);
      else if (typeof error === 'string') cb(error);
      else {
        this.log.error(error);
        cb(new Error('Failed to authenticate Google user.'));
      }
    }
  }
}
