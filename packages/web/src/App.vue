<template>
  <PageLoading v-if="isLoading" />
  <div v-else>
    <LoginForm />
    <!-- <RouterView></RouterView> -->
  </div>
</template>

<script lang="ts" setup>
import LoginForm from '@/components/LoginForm.vue';
import PageLoading from '@/components/PageLoading.vue';
import { ApiClientKey } from '@/injection-keys';
import { inject } from '@/utils';
import { onMounted, ref } from 'vue';

const client = inject(ApiClientKey);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const currentUser = await client.users.getCurrentUser();
    console.log('Current user', currentUser);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style>
@import './assets/bulmaswatch.min.css';
</style>
