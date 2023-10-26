<template>
  <div class="tile is-child box">
    <aside class="menu">
      <p class="menu-label">Select Action</p>
      <ul class="menu-list">
        <li v-if="allowedActions.has(GameAction.BuildMine)">
          <a @click="$emit('buildmine')">Build mine</a>
        </li>

        <li v-if="allowedActions.has(GameAction.Pass)">
          <a @click="$emit('pass')">Pass</a>
        </li>
      </ul>
    </aside>
  </div>
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
  (e: 'pass'): void;
}>();
</script>
