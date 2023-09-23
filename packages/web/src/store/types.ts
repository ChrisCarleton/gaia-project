export enum Action {
  ToastSuccess = 'toastSuccess',
  ToastError = 'toastError',
}

export enum Mutation {
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
  timer: NodeJS.Timeout;
};
