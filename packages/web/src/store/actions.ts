import { EventArgs, Game } from '@gaia-project/engine';
import { v4 as uuid } from 'uuid';
import { ActionTree, Commit } from 'vuex';

import { GaiaProjectState } from './state';
import {
  Action,
  GameState,
  Mutation,
  PlayerState,
  Toast,
  ToastType,
} from './types';

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

export type HandleGameEventArgs = {
  e: EventArgs;
  game: Game;
};

export const actions: ActionTree<GaiaProjectState, GaiaProjectState> = {
  [Action.ToastError]({ commit }, message: string) {
    setToast(commit, message, ToastType.Error);
  },

  [Action.ToastSuccess]({ commit }, message: string) {
    setToast(commit, message, ToastType.Success);
  },

  [Action.InitGame]({ commit }, game: Game) {
    const gameState: GameState = game.serialize();
    const players: PlayerState[] = game.context.players.map((p) => ({
      ...p.toJSON(),
      passed: p.passed,
      structures: { ...p.structures },
    }));

    commit(Mutation.UpdateGame, gameState);
    commit(Mutation.UpdatePlayers, players);
  },

  async [Action.HandleGameEvent](
    { dispatch },
    { game }: HandleGameEventArgs,
  ): Promise<void> {
    // TODO: This is a brute force approach. Handle this more gracefully in the future.
    await dispatch(Action.InitGame, game);
  },
};
