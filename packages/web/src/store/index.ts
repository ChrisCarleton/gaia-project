import { InjectionKey } from 'vue';
import {
  Store,
  createStore as createStoreInternal,
  useStore as useStoreInternal,
} from 'vuex';

import { actions } from './actions';
import { mutations } from './mutations';
import { GaiaProjectState } from './state';

const DefaultState: GaiaProjectState = {
  toasts: {},
  players: [],
};

export const StoreInjectionKey: InjectionKey<Store<GaiaProjectState>> =
  Symbol();

export * from './types';

export function createStore(
  initialState?: Partial<GaiaProjectState>,
): Store<GaiaProjectState> {
  return createStoreInternal({
    state: () => ({
      ...DefaultState,
      ...initialState,
    }),

    actions,
    mutations,
  });
}

export function useStore(): Store<GaiaProjectState> {
  return useStoreInternal(StoreInjectionKey);
}
