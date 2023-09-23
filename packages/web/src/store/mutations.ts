import { User } from '@/apiClient';
import { MutationTree } from 'vuex';

import { GaiaProjectState } from './state';
import { Mutation, Toast } from './types';

export const mutations: MutationTree<GaiaProjectState> = {
  [Mutation.SignInUser](state, payload: User) {
    state.currentUser = payload;
  },

  [Mutation.SignOutUser](state) {
    state.currentUser = undefined;
  },

  [Mutation.Toast](state, toast: Toast) {
    state.toasts[toast.id] = toast;
  },

  [Mutation.DismissToast](state, toastId: string) {
    clearTimeout(state.toasts[toastId].timer);
    delete state.toasts[toastId];
  },
};
