import { Express, Request } from 'express';
import passport from 'passport';
import {
  GoogleCallbackParameters,
  Strategy as GoogleStrategy,
  Profile,
} from 'passport-google-oauth20';

import config from '../config';
import { User, UserManager } from '../users';

type SerializeUserCallback = (err: Error | null, id?: string) => void;
type DeserializeUserCallback = (err: Error | null, user?: User) => void;

export function serializeUser(user: Express.User, cb: SerializeUserCallback) {
  cb(null, user.id);
}

export async function deserializeUser(
  userManager: UserManager,
  id: string,
  cb: DeserializeUserCallback,
): Promise<void> {
  try {
    const user = await userManager.getUser(id);
    cb(null, user);
  } catch (error) {
    cb(<Error>error);
  }
}

export async function verifyGoogleSignin(
  req: Request,
  _accessToken: string,
  _refreshToken: string,
  _params: GoogleCallbackParameters,
  profile: Profile,
  cb: DeserializeUserCallback,
): Promise<void> {
  try {
    // Attempt to find the user with the matching Google ID.
    let user = await req.users.getUserByGoogleId(profile.id);
    if (user) return cb(null, user);

    if (profile.emails?.at(0)?.verified !== 'true') {
      // TODO: Throw a better error here if we cannot access the user's email address.
      return cb(new Error('Nope'));
    }

    // If no user is found, see if we have a user registered with a verified email address on the Google account.
    const email = profile.emails[0].value;
    user = await req.users.getUserByEmail(email);
    if (user) {
      return cb(null, user);
    }

    // Lastly, if we still don't have a match for the user we'll create a new account.
    user = await req.users.createUser({
      avatar: profile.photos?.at(0)?.value,
      email: profile.emails[0].value,
      displayName: profile.displayName,
      googleId: profile.id,
    });

    return cb(null, user);
  } catch (error) {
    cb(<Error>error);
  }
}

export function configureAuth(app: Express, userManager: UserManager) {
  // User session serialization
  passport.serializeUser(serializeUser);
  passport.deserializeUser((id: string, cb: DeserializeUserCallback) =>
    deserializeUser(userManager, id, cb),
  );

  // Add Google strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google.clientId,
        clientSecret: config.google.clientSecret,
        callbackURL: '/api/auth/google/callback',
        passReqToCallback: true,
        scope: ['profile'],
      },
      verifyGoogleSignin,
    ),
  );

  // Initialize session management
  app.use(passport.session());
}
