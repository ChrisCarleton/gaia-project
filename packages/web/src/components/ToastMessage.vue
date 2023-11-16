<template>
  <article :class="`message ${style}`">
    <div class="message-header">
      <p>{{ title }}</p>
      <button class="delete" @click="$emit('dismiss')"></button>
    </div>
    <div class="message-body">
      <p class="content">
        <span class="icon-text">
          <span class="icon">{{ icon }}</span>
          <span>{{ toast.message }}</span>
        </span>
      </p>
    </div>
  </article>
</template>

<script lang="ts" setup>
import { Toast, ToastType } from '@/store';
import { computed } from 'vue';

interface ToastMessageProps {
  toast: Toast;
}

const MessageStyle: Record<
  ToastType,
  { style: string; title: string; icon: string }
> = {
  [ToastType.Error]: {
    title: 'Error',
    style: 'is-danger',
    icon: '❌️',
  },
  [ToastType.Success]: {
    title: 'Success!',
    style: 'is-success',
    icon: '✅',
  },
} as const;

const props = defineProps<ToastMessageProps>();
defineEmits<{
  (e: 'dismiss'): void;
}>();

const title = computed(() => MessageStyle[props.toast.type].title);
const style = computed(() => MessageStyle[props.toast.type].style);
const icon = computed(() => MessageStyle[props.toast.type].icon);
</script>
