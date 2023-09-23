<template>
  <article :class="`message ${style}`">
    <div class="message-header">
      <p>{{ title }}</p>
      <button class="delete" @click="$emit('dismiss')"></button>
    </div>
    <div class="message-body">
      <article class="media">
        <figure class="media-left">
          <span class="icon is-large">
            <i :class="icon"></i>
          </span>
        </figure>
        <div class="media-content">
          <p class="content">
            {{ toast.message }}
          </p>
        </div>
      </article>
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
    icon: 'far fa-times-circle fa-2x',
  },
  [ToastType.Success]: {
    title: 'Success!',
    style: 'is-success',
    icon: 'far fa-check-circle fa-2x',
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
