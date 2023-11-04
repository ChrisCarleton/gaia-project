<template>
  <GameDashboard :context="gameContext" />
</template>

<script lang="ts" setup>
import GameDashboard from '@/components/game/GameDashboard.vue';
import { useStore } from '@/store';
import { computed } from 'vue';

const store = useStore();

const gameContext = computed(() => store.state.gameState);
</script>
