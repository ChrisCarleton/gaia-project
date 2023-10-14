import router from '@/router';
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  split,
} from '@apollo/client/core';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { WsConnectionParams } from '@gaia-project/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { createClient } from 'graphql-ws';
import { createApp } from 'vue';

import App from './App.vue';
import { ApolloGqlClient } from './apiClient';
import { ApiClientInstance } from './apiClient/api-client';
import { ApiClientKey } from './injection-keys';
import { StoreInjectionKey, createStore } from './store';

dayjs.extend(relativeTime);

const store = createStore();

// Split Link - Use Web Sockets for subscriptions and HTTP for queries and mutations.
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  new GraphQLWsLink(
    createClient<WsConnectionParams>({
      url: '/api/ws',
      connectionParams: () => ({
        authToken: store.state.currentUser?.authToken ?? '',
      }),
    }),
  ),
  new HttpLink({
    uri: '/api/graphql',
  }),
);

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
});

const apiClient = new ApiClientInstance(new ApolloGqlClient(apolloClient));

createApp(App)
  .use(router)
  .use(store, StoreInjectionKey)
  .provide(ApiClientKey, apiClient)
  .mount('#app');
