import {
  CurrentUserDto,
  MutationResolvers,
  ProfileUpdateDto,
  ProfileUpdateSchema,
  QueryResolvers,
  UserDto,
} from '@gaia-project/api';
import { Request } from 'express';

import { EmailSchema } from '../../constants';
import { assertValid } from '../../utils';
import { requireAuth } from './utils';

export async function getCurrentUser(ctx: Request): Promise<CurrentUserDto> {
  if (ctx.user) {
    return {
      anonymous: false,
      user: ctx.user.toJSON(),
    };
  }

  return { anonymous: true };
}

export async function updateUserEmail(
  ctx: Request,
  newEmail: string,
): Promise<boolean> {
  const user = requireAuth(ctx);
  assertValid(newEmail, EmailSchema);
  await user.changeEmail(newEmail);
  return true;
}

export async function updateUserProfile(
  ctx: Request,
  profileUpdate: ProfileUpdateDto,
): Promise<UserDto> {
  const user = requireAuth(ctx);
  const update = assertValid(profileUpdate, ProfileUpdateSchema);

  if (update.avatar) user.avatar = update.avatar;
  if (update.displayName) user.displayName = update.displayName;

  await user.save();
  return user.toJSON();
}

export const UserQueries: QueryResolvers<Request> = {
  usersGetCurrent: (_parent, _args, ctx) => getCurrentUser(ctx),
} as const;

export const UserMutations: MutationResolvers<Request> = {
  usersChangeEmail: (_parent, { newEmail }, ctx) =>
    updateUserEmail(ctx, newEmail),
  usersUpdateProfile: (_parent, { update }, ctx) =>
    updateUserProfile(ctx, update),
} as const;
