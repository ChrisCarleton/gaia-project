<template>
  <div class="level tile is-child box">
    <div class="level-left">
      <div class="level-item">
        <div>
          <p class="heading">Round #</p>
          <p class="title">{{ round }}</p>
        </div>
      </div>
      <div class="level-item">
        <div>
          <p class="heading">Current Player</p>
          <p class="title">{{ currentPlayer?.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Player } from '@gaia-project/engine';

interface GameStatusTileProps {
  currentPlayer?: Player;
  round: number;
}

defineProps<GameStatusTileProps>();
</script>
