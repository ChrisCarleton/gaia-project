import Logger from 'bunyan';

import { User as AppUser, UserManager } from '../users';

declare global {
  namespace Express {
    export interface Request {
      log: Logger;
      users: UserManager;
    }

    export interface User extends AppUser {}
  }
}

export {};
