import { z } from 'zod';

import { EmailSchema } from '../constants';

export const UserSchema = z.object({
  _id: z.string(),
  avatar: z.string().url().optional(),
  email: EmailSchema,
  emailLowered: EmailSchema.toLowerCase(),
  displayName: z.string().trim().max(100),
  googleId: z.string().optional(),
  memberSince: z.coerce.date(),
});

export type UserDocument = z.infer<typeof UserSchema>;
