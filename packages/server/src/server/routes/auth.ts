import { CurrentUserDTO } from '@gaia-project/api';
import { Express, NextFunction, Request, Response } from 'express';
import passport from 'passport';

import config from '../../config';
import { issueAuthCookie } from '../auth';

const GoogleAuthRoute = '/api/auth/google';
const GoogleAuthCallbackRoute = `${GoogleAuthRoute}/callback`;

export function getCurrentUser(req: Request, res: Response) {
  const json: CurrentUserDTO = req.user
    ? {
        anonymous: false,
        ...req.user.toJSON(),
      }
    : { anonymous: true };

  if (req.log.debug()) {
    req.log.debug('Returning current user info', json);
  }

  res.json(json);
}

export function logout(req: Request, res: Response, next: NextFunction) {
  req.logout({ keepSessionInfo: false }, (error) => {
    next(error);
  });
}

export function configureAuthRoutes(app: Express) {
  app.get(GoogleAuthRoute, passport.authenticate('google'));
  app.get(
    GoogleAuthCallbackRoute,
    passport.authenticate('google', {
      failureRedirect: new URL('/loginFailed', config.baseUrl).toString(),
      session: false,
    }),
    async (req, res): Promise<void> => {
      if (req.log.info()) {
        req.log.info('User successfully authenticated using Google.', req.user);
      }

      if (req.user) {
        await issueAuthCookie(req.user, res);
      }

      res.redirect(config.baseUrl);
    },
  );

  app.get('/api/auth/me', getCurrentUser);
  app.get('/api/auth/logout', logout, (req, res) => {
    if (req.log.debug()) {
      req.log.debug('User successfully logged out');
    }
    res.redirect(config.baseUrl);
  });
}
