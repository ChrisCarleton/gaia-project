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
                    <RouterLink to="/lobby/new">
                      <button class="button is-primary is-large">
                        Create Lobby
                      </button>
                    </RouterLink>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showJoinGameDialog = ref(false);

async function onJoinLobby(gameId: string) {
  console.log(gameId);
  showJoinGameDialog.value = false;
  router.push(`/lobby/${gameId}`);
}

async function onCreateLobby(): Promise<void> {}
</script>
