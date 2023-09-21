import { InjectionKey } from 'vue';

import { ApiClient } from './apiClient';

export const ApiClientKey: InjectionKey<ApiClient> = Symbol('ApiClient');
