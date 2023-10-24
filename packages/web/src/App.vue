<template>
  <PageLoading v-if="isLoading"></PageLoading>
  <div v-else>
    <NavBar />
    <RouterView></RouterView>
  </div>
  <ToastGroup></ToastGroup>
</template>

<script lang="ts" setup>
import NavBar from '@/components/NavBar.vue';
import PageLoading from '@/components/PageLoading.vue';
import ToastGroup from '@/components/ToastGroup.vue';
import { ApiClientKey } from '@/injection-keys';
import { inject, useErrorHandling } from '@/utils';
import { nextTick, onMounted, ref } from 'vue';

import { Mutation, useStore } from './store';

const store = useStore();
const handleError = useErrorHandling();
const client = inject(ApiClientKey);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const user = await client.users.getCurrentUser();
    if (user) store.commit(Mutation.SignInUser, user);
  } catch (error) {
    handleError(error);
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
