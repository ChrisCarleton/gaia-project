import { User } from '@/apiClient';
import { SerializedGameContext } from '@gaia-project/engine/src/core/serialization';
import { MutationTree } from 'vuex';

import { GaiaProjectState } from './state';
import { GameState, Mutation, PlayerState, Toast } from './types';

export const mutations: MutationTree<GaiaProjectState> = {
  [Mutation.LoadGame](state, payload: SerializedGameContext) {
    state.loadedGame = payload;
  },

  [Mutation.RestartGame](state) {
    state.loadedGame = undefined;
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

  [Mutation.UpdatePlayer](
    state,
    payload: { index: number; playerState: PlayerState },
  ) {
    const { index, playerState } = payload;

    if (index < 0 || index >= state.players.length) {
      console.warn('Invalid player index:', index);
    }

    state.players.splice(index, 1, playerState);
  },

  [Mutation.UpdatePlayers](state, payload: PlayerState[]) {
    state.players = payload;
  },

  [Mutation.UpdateGame](state, payload: GameState) {
    state.gameState = payload;
  },
};
