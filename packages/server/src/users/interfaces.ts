import { z } from 'zod';

import { UserSchema } from '../data';

export const CreateUserOptionsSchema = UserSchema.pick({
  email: true,
  avatar: true,
  googleId: true,
  displayName: true,
});
export type CreateUserOptions = z.infer<typeof CreateUserOptionsSchema>;

export type UserDTO = {
  avatar?: string;
  displayName?: string;
  id: string;
  email: string;
};

export interface User {
  readonly id: string;
  email: string;

  avatar?: string;
  displayName?: string;
  googleId?: string;

  changeEmail(newEmail: string): Promise<void>;
  save(): Promise<void>;
  toJSON(): UserDTO;
}

export interface UserManager {
  createUser(options: CreateUserOptions): Promise<User>;
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
}
