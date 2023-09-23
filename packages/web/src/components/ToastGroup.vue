<template>
  <div class="toast-group">
    <ToastMessage
      v-for="toast in toasts"
      :key="toast.id"
      :toast="toast"
      @dismiss="() => onDismiss(toast.id)"
    ></ToastMessage>
  </div>
</template>

<script lang="ts" setup>
import ToastMessage from '@/components/ToastMessage.vue';
import { Mutation, useStore } from '@/store';
import { computed, nextTick } from 'vue';

const store = useStore();
const toasts = computed(() => Object.values(store.state.toasts));

function onDismiss(toastId: string) {
  nextTick(() => {
    store.commit(Mutation.DismissToast, toastId);
  });
}
</script>

<style>
.toast-group {
  min-width: 250px; /* Set a default minimum width */
  margin-left: -125px; /* Divide value of min-width by 2 */
  text-align: center; /* Centered text */
  padding: 16px; /* Padding */
  position: fixed; /* Sit on top of the screen */
  z-index: 1; /* Add a z-index if needed */
  right: 150px; /* Center the snackbar */
  bottom: 30px; /* 30px from the bottom */
}
</style>
