<template>
  <figure class="image is-64x64">
    <img class="is-rounded" :src="avatar" />
  </figure>
</template>

<script lang="ts" setup>
import { User } from '@/apiClient';
import { computed } from 'vue';

interface PlayerAvatarProps {
  player: User;
}

const props = defineProps<PlayerAvatarProps>();
const avatar = computed(() => props.player.avatar ?? '');
</script>
