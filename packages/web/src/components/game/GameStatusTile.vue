<template>
  <div class="tile is-child card">
    <div class="card-header">
      <p class="card-header-title">Game Status</p>
    </div>

    <div class="card-content">
      <div class="level">
        <div class="level-left">
          <StatWithHeading
            v-if="round"
            heading="Round #"
            :stat="round"
          ></StatWithHeading>
          <StatWithHeading
            heading="Current Player"
            :stat="currentPlayer?.name ?? ''"
          ></StatWithHeading>
        </div>
        <div class="level-right">
          <button class="button is-ghost">Research Board</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PlayerState } from '@/store';

import StatWithHeading from '../StatWithHeading.vue';

interface GameStatusTileProps {
  currentPlayer?: PlayerState;
  round: number;
}

defineProps<GameStatusTileProps>();
</script>
