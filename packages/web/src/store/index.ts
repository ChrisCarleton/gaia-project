import { InjectionKey } from 'vue';
import {
  Store,
  createStore as createStoreInternal,
  useStore as useStoreInternal,
} from 'vuex';

import { GaiaProjectState } from './state';

const DefaultState: GaiaProjectState = {};

export const StoreInjectionKey: InjectionKey<Store<GaiaProjectState>> =
  Symbol();

export function createStore(
  initialState?: Partial<GaiaProjectState>,
): Store<GaiaProjectState> {
  return createStoreInternal({
    state: () => ({
      ...DefaultState,
      ...initialState,
    }),
  });
}

export function useStore(): Store<GaiaProjectState> {
  return useStoreInternal(StoreInjectionKey);
}
