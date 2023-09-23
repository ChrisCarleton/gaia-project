import { ProfileUpdate, ProfileUpdateSchema } from '@gaia-project/api';
import { Express, Request, Response } from 'express';

import { assertValid } from '../../utils';
import { requireAuth } from './auth';

export async function updateProfile(
  req: Request,
  res: Response,
): Promise<void> {
  if (!req.user) {
    throw new Error('Expected user to be logged in');
  }

  const { avatar, displayName } = assertValid<ProfileUpdate>(
    req.body,
    ProfileUpdateSchema,
  );

  req.user.avatar = avatar;
  req.user.displayName = displayName;
  await req.user.save();

  res.json(req.user.toJSON());
}

export function configureUserRoutes(app: Express) {
  app.route('/api/profile/:id').put(requireAuth, updateProfile);
}
