import { Express, Request, Response } from 'express';
import passport from 'passport';

import config from '../../config';
import { UserDTO } from '../../users';

const GoogleAuthRoute = '/api/auth/google';
const GoogleAuthCallbackRoute = `${GoogleAuthRoute}/callback`;
type GetCurrentUserResposne =
  | { anonymous: true }
  | ({ anonymous: false } & UserDTO);

export function getCurrentUser(req: Request, res: Response) {
  const json: GetCurrentUserResposne = req.user
    ? {
        anonymous: !!req.user,
        ...req.user.toJSON(),
      }
    : { anonymous: true };

  res.json(json);
}

export function configureAuthRoutes(app: Express) {
  app.get(GoogleAuthRoute, passport.authenticate('google'));
  app.get(
    GoogleAuthCallbackRoute,
    passport.authenticate('google', {
      failureRedirect: new URL('/loginFailed', config.baseUrl).toString(),
      successRedirect: config.baseUrl,
    }),
  );

  app.get('/api/auth/me', getCurrentUser);
}
