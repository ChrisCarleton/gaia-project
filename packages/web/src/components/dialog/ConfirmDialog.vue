<template>
  <DialogBase :title="title" @close="$emit('cancel')">
    <template #default>
      <slot></slot>
    </template>

    <template #buttons>
      <button
        :class="`button ${dangerous ? 'is-danger' : 'is-primary'}`"
        @click="$emit('confirm')"
      >
        {{ confirmButtonText }}
      </button>

      <button class="button is-ghost" @click="$emit('cancel')">
        {{ cancelButtonText }}
      </button>
    </template>
  </DialogBase>
</template>

<script lang="ts" setup>
import DialogBase from '@/components/dialog/DialogBase.vue';

interface ConfirmDialogProps {
  cancelButtonText?: string;
  confirmButtonText?: string;
  dangerous?: boolean;
  title?: string;
}

withDefaults(defineProps<ConfirmDialogProps>(), {
  cancelButtonText: 'Cancel',
  confirmButtonText: 'Ok',
  dangerous: false,
  title: 'Confirm action?',
});

defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();
</script>
