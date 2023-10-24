<template>
  <div v-if="visible" class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head is-success">
        <p class="modal-card-title">Game over, man! Game over!!</p>
      </header>
      <section class="modal-card-body is-size-4">
        <table class="table is-fullwidth is-hoverable">
          <thead>
            <tr>
              <th class="has-text-right">
                <abbr title="Rank">#</abbr>
              </th>
              <th>Player</th>
              <th class="has-text-centered">
                <abbr title="Victory Points">VP</abbr>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(player, i) in playerRankings" :key="player.id">
              <td class="has-text-right">{{ i + 1 }}</td>
              <td v-if="player.vp === playerRankings[0].vp">
                🎉 {{ player.name }} 🎉
              </td>
              <td v-else>{{ player.name }}</td>
              <td class="has-text-centered">{{ player.vp }}</td>
            </tr>
          </tbody>
        </table>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-primary">Okey dokey</button>
      </footer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Player } from '@gaia-project/engine';

interface GameEndedDialogProps {
  playerRankings?: Readonly<Player[]>;
  visible?: boolean;
}

withDefaults(defineProps<GameEndedDialogProps>(), {
  playerRankings: () => new Array<Player>(),
  visible: false,
});
</script>
