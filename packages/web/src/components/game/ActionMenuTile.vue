<template>
  <nav class="tile is-child panel">
    <p class="panel-heading">Select Action</p>
    <a
      v-if="allowedActions.has(GameAction.BuildMine)"
      class="panel-block"
      @click="$emit('buildmine')"
      >Build mine</a
    >

    <a
      v-if="allowedActions.has(GameAction.SelectRoundBooster)"
      class="panel-block"
      @click="$emit('pass')"
      >Select Round Booster</a
    >

    <a
      v-if="allowedActions.has(GameAction.Research)"
      class="panel-block"
      @click="$emit('research')"
      >Research</a
    >

    <a
      v-if="allowedActions.has(GameAction.Pass)"
      class="panel-block"
      @click="$emit('pass')"
      >Pass</a
    >
  </nav>
</template>

<script lang="ts" setup>
import { GameAction, Player } from '@gaia-project/engine';

interface ActionMenuTileProps {
  allowedActions: Set<GameAction>;
  currentPlayer?: Player;
}

defineProps<ActionMenuTileProps>();

defineEmits<{
  (e: 'buildmine'): void;
  (e: 'research'): void;
  (e: 'pass'): void;
}>();
</script>
