<template>
  <PageTitle title="Game Lobby"></PageTitle>
  <RequireAuth>
    <PageLoading v-if="isLoading"></PageLoading>
    <section v-else-if="lobby" class="section">
      <div class="container">
        <LobbyHub :lobby="lobby"></LobbyHub>
      </div>
    </section>
  </RequireAuth>
</template>

<script lang="ts" setup>
import { Lobby } from '@/apiClient';
import LobbyHub from '@/components/LobbyHub.vue';
import PageLoading from '@/components/PageLoading.vue';
import PageTitle from '@/components/PageTitle.vue';
import RequireAuth from '@/components/RequireAuth.vue';
import { ApiClientKey } from '@/injection-keys';
import { inject, useErrorHandling } from '@/utils';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const errorHandler = useErrorHandling();
const client = inject(ApiClientKey);

const isLoading = ref(true);
const lobby = ref<Lobby | undefined>();

onMounted(async () => {
  try {
    lobby.value = await client.lobbies.getLobby(route.params.gameId as string);
  } catch (error) {
    await errorHandler(error);
  } finally {
    isLoading.value = false;
  }
});
</script>
