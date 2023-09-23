<template>
  <PageLoading v-if="isLoading"></PageLoading>
  <v-else>
    <NavBar></NavBar>
    <RouterView></RouterView>
  </v-else>
  <ToastGroup></ToastGroup>
</template>

<script lang="ts" setup>
import NavBar from '@/components/NavBar.vue';
import PageLoading from '@/components/PageLoading.vue';
import ToastGroup from '@/components/ToastGroup.vue';
import { ApiClientKey } from '@/injection-keys';
import { inject } from '@/utils';
import { nextTick, onMounted, ref } from 'vue';

import { Mutation, useStore } from './store';

const store = useStore();
const client = inject(ApiClientKey);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const user = await client.users.getCurrentUser();
    store.commit(Mutation.SignInUser, user);
  } catch (error) {
    console.error(error);
    // TODO: Need a server error page.
  } finally {
    nextTick(() => {
      isLoading.value = false;
    });
  }
});
</script>

<style>
@import './assets/bulmaswatch.min.css';
</style>
