import { User } from '@/apiClient';
import { SerializedGameContext } from '@gaia-project/engine/src/core/serialization';

import { GameState, PlayerState, Toast } from './types';

export interface GaiaProjectState {
  currentUser?: User;
  toasts: Record<string, Toast>;

  loadedGame?: SerializedGameContext;

  gameState?: GameState;
  players: PlayerState[];
}
