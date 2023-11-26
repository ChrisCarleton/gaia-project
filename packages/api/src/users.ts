import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  avatar: z.string().url().optional(),
  displayName: z.string().min(1).max(150),
  memberSince: z.coerce.date(),
});
export type UserDTO = z.infer<typeof UserSchema>;

export const CurrentUserSchema = z.discriminatedUnion('anonymous', [
  z.object({ anonymous: z.literal(true) }),
  z.object({
    anonymous: z.literal(false),
    user: UserSchema,
  }),
]);
export type CurrentUserDTO = z.infer<typeof CurrentUserSchema>;
