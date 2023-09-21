export interface User {
  readonly id: string;
  readonly email: string;
  avatar?: string;
  displayName?: string;
  changeEmail(newEmail: string): Promise<void>;
  save(): Promise<void>;
}

export interface UserManager {
  getCurrentUser(): Promise<User | undefined>;
}

export interface ApiClient {
  readonly users: UserManager;
}
