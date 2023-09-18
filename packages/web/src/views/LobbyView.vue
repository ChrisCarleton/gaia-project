<template>
  <PageTitle
    title="Game Lobby"
    :subtitle="`Game ID: ${route.params.gameId}`"
  ></PageTitle>
  <section class="section">
    <div class="container">Lobby</div>
  </section>
</template>

<script lang="ts" setup>
import PageTitle from '@/components/PageTitle.vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

onMounted(() => {});
</script>
