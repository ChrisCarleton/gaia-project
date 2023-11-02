import { User } from '@/apiClient';
import { SerializedGameContext } from '@gaia-project/engine/src/core/serialization';
import { MutationTree } from 'vuex';

import { GaiaProjectState } from './state';
import { Mutation, Toast } from './types';

export const mutations: MutationTree<GaiaProjectState> = {
  [Mutation.GameSnapshot](state, payload: SerializedGameContext) {
    state.currentGameSnapshot = payload;
  },

  [Mutation.LoadGame](state, payload: SerializedGameContext) {
    state.gameState = payload;
  },

  [Mutation.RestartGame](state) {
    state.gameState = undefined;
  },

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
