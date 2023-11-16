import { Timeout } from '@/utils';
import { PlayerStructures } from '@gaia-project/engine';
import {
  SerializedGameContext,
  SerializedPlayer,
} from '@gaia-project/engine/src/core/serialization';

export enum Action {
  ToastSuccess = 'toastSuccess',
  ToastError = 'toastError',

  InitGame = 'initGame',

  HandleGameEvent = 'handleGameEvent',
}

export enum Mutation {
  LoadGame = 'loadGame',
  RestartGame = 'restartGame',

  SignInUser = 'signInUser',
  SignOutUser = 'signOutUser',

  Toast = 'toast',
  DismissToast = 'dismissToast',

  UpdatePlayer = 'updatePlayer',
  UpdatePlayers = 'updatePlayers',
  UpdateGame = 'updateGame',
}

export type GameState = Omit<SerializedGameContext, 'players'>;
export type PlayerState = SerializedPlayer & {
  passed: boolean;
  structures: PlayerStructures;
};

export enum ToastType {
  Success = 'success',
  Error = 'error',
}

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
  timer: Timeout;
};
