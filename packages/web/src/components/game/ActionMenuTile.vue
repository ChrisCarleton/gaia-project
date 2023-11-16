<template>
  <div class="tile is-child card">
    <div class="card-header">
      <p class="card-header-title">Select Action</p>
    </div>

    <div class="card-content">
      <nav class="panel">
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PlayerState } from '@/store';
import { GameAction } from '@gaia-project/engine';

interface ActionMenuTileProps {
  allowedActions: Set<GameAction>;
  currentPlayer?: PlayerState;
}

defineProps<ActionMenuTileProps>();

defineEmits<{
  (e: 'buildmine'): void;
  (e: 'research'): void;
  (e: 'pass'): void;
}>();
</script>
