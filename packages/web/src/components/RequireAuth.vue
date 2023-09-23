<template>
  <slot v-if="store.state.currentUser"></slot>
  <LoginForm v-else></LoginForm>
</template>

<script lang="ts" setup>
import LoginForm from '@/components/LoginForm.vue';
import { useStore } from '@/store';

const store = useStore();
</script>
