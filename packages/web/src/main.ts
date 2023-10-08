import router from '@/router';
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { createApp } from 'vue';

import App from './App.vue';
import { ApolloGqlClient } from './apiClient';
import { ApiClientInstance } from './apiClient/api-client';
import { ApiClientKey } from './injection-keys';
import { StoreInjectionKey, createStore } from './store';

dayjs.extend(relativeTime);

const apolloClient = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache(),
});
const gqlClient = new ApolloGqlClient(apolloClient);
const apiClient = new ApiClientInstance(gqlClient);
const store = createStore();

createApp(App)
  .use(router)
  .use(store, StoreInjectionKey)
  .provide(ApiClientKey, apiClient)
  .mount('#app');
