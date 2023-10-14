import Logger from 'bunyan';

import { LobbyManager } from '../games';
import { User as AppUser, UserManager } from '../users';

declare global {
  namespace Express {
    export interface Request {
      log: Logger;
      users: UserManager;
      lobbies: LobbyManager;
    }

    export interface User extends AppUser {}
  }
}

export {};
