import { z } from 'zod';

import { EmailSchema } from '../constants';

export const UserSchema = z.object({
  _id: z.string(),
  avatar: z.string().url().optional(),
  email: EmailSchema,
  emailLowered: EmailSchema.toLowerCase(),
  displayName: z.string().trim().max(100).optional(),
  googleId: z.string().optional(),
});

export type UserDocument = z.infer<typeof UserSchema>;
