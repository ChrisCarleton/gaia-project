import router from '@/router';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import request from 'superagent';
import { createApp } from 'vue';

import App from './App.vue';
import { ApiClientInstance } from './apiClient/api-client';
import { ApiClientKey } from './injection-keys';
import { StoreInjectionKey, createStore } from './store';

dayjs.extend(relativeTime);

const agent = request.agent();
const apiClient = new ApiClientInstance(agent);
const store = createStore();

createApp(App)
  .use(router)
  .use(store, StoreInjectionKey)
  .provide(ApiClientKey, apiClient)
  .mount('#app');
