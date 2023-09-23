import { v4 as uuid } from 'uuid';
import { ActionTree, Commit } from 'vuex';

import { GaiaProjectState } from './state';
import { Action, Mutation, Toast, ToastType } from './types';

function setToast(commit: Commit, message: string, type: ToastType) {
  const id = uuid();
  const toast: Toast = {
    id,
    type,
    message,
    timer: setTimeout(() => {
      commit(Mutation.DismissToast, id);
    }, 6000),
  };
  commit(Mutation.Toast, toast);
}

export const actions: ActionTree<GaiaProjectState, GaiaProjectState> = {
  [Action.ToastError]({ commit }, message: string) {
    setToast(commit, message, ToastType.Error);
  },

  [Action.ToastSuccess]({ commit }, message: string) {
    setToast(commit, message, ToastType.Success);
  },
};
