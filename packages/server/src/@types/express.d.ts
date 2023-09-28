import Logger from 'bunyan';

import { Lobby, LobbyManager } from '../games';
import { User as AppUser, UserManager } from '../users';

declare global {
  namespace Express {
    export interface Request {
      currentLobby?: Lobby;
      log: Logger;
      users: UserManager;
      lobbies: LobbyManager;
    }

    export interface User extends AppUser {}
  }
}

export {};
