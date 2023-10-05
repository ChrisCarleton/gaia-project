import { Request } from 'express';

import { UnauthorizedError } from '../../errors';
import { User } from '../../users';

export function requireAuth(ctx: Request, message?: string): User {
  if (ctx.user) return ctx.user;

  throw new UnauthorizedError(
    message ?? 'User must be signed in to perform this action',
  );
}
