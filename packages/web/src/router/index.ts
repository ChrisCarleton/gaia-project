import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: import(/* webpackChunkName: "home" */ '@/views/HomeView.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    component: import(
      /* webpackChunkName: "profile" */ '@/views/ProfileView.vue'
    ),
  },
  {
    path: '/lobby/:gameId',
    name: 'lobby',
    component: import(/* webpackChunkName: "lobby" */ '@/views/LobbyView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: import(
      /* webChunkName: "notFound" */ '@/views/NotFoundView.vue'
    ),
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
