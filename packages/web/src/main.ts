import router from '@/router';
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { createApp } from 'vue';

import App from './App.vue';
import { ApiClientInstance } from './apiClient/api-client';
import { ApiClientKey } from './injection-keys';
import { StoreInjectionKey, createStore } from './store';

dayjs.extend(relativeTime);

const gqlClient = new ApolloClient({
  uri: '/api',
  cache: new InMemoryCache(),
});
const apiClient = new ApiClientInstance(gqlClient);
const store = createStore();

createApp(App)
  .use(router)
  .use(store, StoreInjectionKey)
  .provide(ApiClientKey, apiClient)
  .mount('#app');
