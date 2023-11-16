<template>
  <GameDashboard :context="store.state.loadedGame" />
</template>

<script lang="ts" setup>
import GameDashboard from '@/components/game/GameDashboard.vue';
import { useStore } from '@/store';

const store = useStore();
</script>
