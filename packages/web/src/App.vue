<template>
  <RouterView></RouterView>
</template>

<script lang="ts" setup>
import RenderWindow from '@/components/RenderWindow.vue';
</script>

<style>
@import './assets/bulmaswatch.min.css';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
