import router from '@/router';
import request from 'superagent';
import { createApp } from 'vue';

import App from './App.vue';
import { ApiClientInstance } from './apiClient/api-client';
import { ApiClientKey } from './injection-keys';
import { StoreInjectionKey, createStore } from './store';

const agent = request.agent();
const apiClient = new ApiClientInstance(agent);
const store = createStore();

createApp(App)
  .use(router)
  .use(store, StoreInjectionKey)
  .provide(ApiClientKey, apiClient)
  .mount('#app');
