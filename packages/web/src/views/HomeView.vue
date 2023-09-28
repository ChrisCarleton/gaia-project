<template>
  <PageTitle title="Create or Join Lobby"></PageTitle>
  <section class="section">
    <div class="container">
      <RequireAuth>
        <div class="tile is-ancestor">
          <div class="tile is-parent is-6">
            <div class="tile is-child message">
              <div class="message-body">
                <div class="field">
                  <div class="control has-text-centered">
                    <button
                      :class="`button is-primary is-large${
                        isCreatingLobby ? ' is-loading' : ''
                      }`"
                      :disabled="isCreatingLobby"
                      @click="onCreateLobby"
                    >
                      Create Lobby
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="tile is-parent is-6">
            <div class="tile is-child message">
              <div class="message-body">
                <div class="field">
                  <div class="control has-text-centered">
                    <button
                      class="button is-large"
                      @click="() => (showJoinGameDialog = true)"
                    >
                      Join Game...
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RequireAuth>

      <JoinGameDialog
        :visible="showJoinGameDialog"
        @close="() => (showJoinGameDialog = false)"
        @join="onJoinLobby"
      ></JoinGameDialog>
    </div>
  </section>
</template>

<script lang="ts" setup>
import JoinGameDialog from '@/components/JoinGameDialog.vue';
import PageTitle from '@/components/PageTitle.vue';
import RequireAuth from '@/components/RequireAuth.vue';
import { ApiClientKey } from '@/injection-keys';
import { inject, useErrorHandling } from '@/utils';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const client = inject(ApiClientKey);
const router = useRouter();
const showJoinGameDialog = ref(false);
const isCreatingLobby = ref(false);
const handleError = useErrorHandling();

async function onJoinLobby(lobbyId: string) {
  showJoinGameDialog.value = false;
  router.push(`/lobby/${lobbyId}`);
}

async function onCreateLobby(): Promise<void> {
  isCreatingLobby.value = true;

  try {
    const { id } = await client.lobbies.createLobby();
    await router.push(`/lobby/${id}`);
  } catch (error) {
    await handleError(error);
  } finally {
    isCreatingLobby.value = false;
  }
}
</script>
