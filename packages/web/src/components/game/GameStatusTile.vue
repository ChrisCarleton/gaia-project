<template>
  <div class="tile is-child card">
    <div class="card-header">
      <p class="card-header-title">Game Status</p>
    </div>

    <div class="card-content">
      <div class="level">
        <StatWithHeading heading="Round #" :stat="round" />
        <StatWithHeading
          heading="Current Player"
          :stat="currentPlayer?.name ?? ''"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Player } from '@gaia-project/engine';

import StatWithHeading from '../StatWithHeading.vue';

interface GameStatusTileProps {
  currentPlayer?: Player;
  round: number;
}

defineProps<GameStatusTileProps>();
</script>
