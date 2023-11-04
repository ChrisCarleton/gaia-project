import { User } from '@/apiClient';
import { SerializedGameContext } from '@gaia-project/engine/src/core/serialization';

import { Toast } from './types';

export interface GaiaProjectState {
  currentUser?: User;
  currentGameSnapshot?: SerializedGameContext;
  gameState?: SerializedGameContext;
  toasts: Record<string, Toast>;
}
