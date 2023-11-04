import { Timeout } from '@/utils';

export enum Action {
  ToastSuccess = 'toastSuccess',
  ToastError = 'toastError',
}

export enum Mutation {
  GameSnapshot = 'gameSnapshot',
  LoadGame = 'loadGame',
  RestartGame = 'restartGame',

  SignInUser = 'signInUser',
  SignOutUser = 'signOutUser',

  Toast = 'toast',
  DismissToast = 'dismissToast',
}

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
