import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: import(/* webpackChunkName: "home" */ '@/views/HomeView.vue'),
  },
  {
    path: '/lobby/:gameId',
    name: 'lobby',
    component: import(/* webpackChunkName: "lobby" */ '@/views/LobbyView.vue'),
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
