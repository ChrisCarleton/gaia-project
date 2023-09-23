import { z } from 'zod';

export const UserDTOSchema = z.object({
  avatar: z.string().trim().optional(),
  displayName: z.string().trim().optional(),
  id: z.string(),
  email: z.string(),
  memberSince: z.coerce.date(),
});
export type UserDTO = z.infer<typeof UserDTOSchema>;

export const CurrentUserDTOSchema = z.discriminatedUnion('anonymous', [
  z.object({ anonymous: z.literal(true) }),
  UserDTOSchema.merge(z.object({ anonymous: z.literal(false) })),
]);
export type CurrentUserDTO = z.infer<typeof CurrentUserDTOSchema>;

export const ProfileUpdateSchema = UserDTOSchema.pick({
  avatar: true,
  displayName: true,
});
export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>;
