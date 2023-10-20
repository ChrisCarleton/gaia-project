<template>
  <div class="level tile is-child box">
    <div class="level-item">
      Current player: {{ context.currentPlayer?.name }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { GameContext } from '@gaia-project/engine';

interface GameStatusTileProps {
  context: GameContext;
}

defineProps<GameStatusTileProps>();
</script>
