import { z } from 'zod';

export const ProfileUpdateSchema = z.object({
  avatar: z.string().url().nullable().optional(),
  displayName: z.string().max(100).nullable().optional(),
});
export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>;
