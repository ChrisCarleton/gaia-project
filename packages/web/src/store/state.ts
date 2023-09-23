import { User } from '@/apiClient';

import { Toast } from './types';

export interface GaiaProjectState {
  currentUser?: User;
  toasts: Record<string, Toast>;
}
