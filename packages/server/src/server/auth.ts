import { Express, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import passport from 'passport';
import {
  GoogleCallbackParameters,
  Strategy as GoogleStrategy,
  Profile,
} from 'passport-google-oauth20';
import { URL } from 'url';

import config from '../config';
import { ForbiddenError } from '../errors';
import { User } from '../users';

const Algorithm = 'HS256';
const Audience = 'player';
const BearerTokenRegex = /^Bearer .*/i;
const Issuer = 'gp-server';

type DeserializeUserCallback = (err: Error | null, user?: User) => void;

export function signJwtToken(user: User): Promise<string> {
  const payload: JwtPayload = {
    aud: Audience,
    exp: config.sessionTTLInSeconds * 1000 + Date.now(),
    iat: Date.now(),
    iss: Issuer,
    sub: user.id,
  };

  return new Promise<string>((resolve, reject) => {
    jwt.sign(
      payload,
      config.sessionSecret,
      {
        algorithm: Algorithm,
      },
      (error, token) => {
        if (error) reject(error);
        else resolve(token!);
      },
    );
  });
}

export async function issueAuthCookie(user: User, res: Response) {
  const token = await signJwtToken(user);
  res.cookie(config.cookieName, token, {
    domain: new URL(config.baseUrl).hostname,
    httpOnly: true,
    maxAge: config.sessionTTLInSeconds * 1000,
    sameSite: 'strict',
    secure: config.isProduction,
  });
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
    if (req.log.debug()) {
      req.log.debug('Received response from Google:', profile);
    }

    // Attempt to find the user with the matching Google ID.
    let user = await req.users.getUserByGoogleId(profile.id);
    if (user) {
      if (req.log.info()) {
        req.log.info(
          `Successfully signed in user "${user.email}" using Google OAuth.`,
        );
      }
      return cb(null, user);
    }

    if (!profile.emails?.at(0)?.verified) {
      return cb(
        new ForbiddenError(
          'Unable to log in user. No verified email address was provided.',
        ),
      );
    }

    // If no user is found, see if we have a user registered with a verified email address on the Google account.
    const email = profile.emails[0].value;
    user = await req.users.getUserByEmail(email);
    if (user) {
      user.googleId = profile.id;
      await user.save();

      if (req.log.info()) {
        req.log.info(
          `Successfully, linked account with email "${user.email}" to Google account with ID "${profile.id}"`,
        );
      }
      return cb(null, user);
    }

    // Lastly, if we still don't have a match for the user we'll create a new account.
    user = await req.users.createUser({
      avatar: profile.photos?.at(0)?.value,
      email: profile.emails[0].value,
      displayName: profile.displayName,
      googleId: profile.id,
    });

    if (req.log.info()) {
      req.log.info(
        `Created new account for user with Google ID "${profile.id}".`,
        {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
        },
      );
    }
    return cb(null, user);
  } catch (error) {
    cb(<Error>error);
  }
}

export function extractJwtTokenFromRequest(req: Request): string | null {
  // First look for a Bearer token in the Authorization header
  if (
    req.headers &&
    req.headers.authorization &&
    BearerTokenRegex.test(req.headers.authorization)
  ) {
    return req.headers.authorization.substring(7).trim();
  }

  // If not found, look for the token in the session cookie.
  if (req.cookies && req.cookies[config.cookieName]) {
    return req.cookies[config.cookieName];
  }

  // Otherwise, no token found!
  return null;
}

export async function verifyJwtToken(req: Request): Promise<User | undefined> {
  const token = extractJwtTokenFromRequest(req);
  if (!token) return;

  const userId = await new Promise<string | null>((resolve, reject) => {
    jwt.verify(token, config.sessionSecret, {}, (error, payload) => {
      if (error) {
        reject(error);
        return;
      }

      if (typeof payload === 'string') {
        resolve(payload);
        return;
      }

      resolve(payload?.sub ?? null);
    });
  });

  if (!userId) return undefined;

  return req.users.getUser(userId);
}

export function configureAuth(app: Express) {
  // Add Google strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google.clientId,
        clientSecret: config.google.clientSecret,
        callbackURL: new URL(
          '/api/auth/google/callback',
          config.baseUrl,
        ).toString(),
        passReqToCallback: true,
        scope: ['email', 'profile'],
      },
      verifyGoogleSignin,
    ),
  );

  // Verify JWT token and load user account
  app.use(async (req, _res, next): Promise<void> => {
    try {
      req.user = await verifyJwtToken(req);
    } catch (error) {
      req.log.error(error);
    }

    next();
  });
}
