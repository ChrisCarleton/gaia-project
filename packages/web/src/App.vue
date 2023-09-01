<template>
  <RenderWindow :render="renderLoop" />
</template>

<script lang="ts" setup>
import { renderLoop } from './graphics';
import RenderWindow from '@/components/RenderWindow.vue';
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
