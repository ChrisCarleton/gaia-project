import { CurrentUserDto, QueryResolvers } from '@gaia-project/api';
import { Request } from 'express';

export async function getCurrentUser(req: Request): Promise<CurrentUserDto> {
  if (req.user) {
    return {
      anonymous: false,
      user: req.user.toJSON(),
    };
  }

  return { anonymous: true };
}

export const UserQueries: QueryResolvers<Request> = {
  usersGetCurrent: (_parent, _args, ctx) => getCurrentUser(ctx),
} as const;
