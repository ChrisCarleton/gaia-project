<template>
  <div v-if="visible" class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <!-- Header -->
      <header class="modal-card-head">
        <p class="modal-card-title">{{ title }}</p>
        <button
          v-if="showClose"
          class="delete"
          @click="$emit('close')"
        ></button>
      </header>

      <!-- Body -->
      <section class="modal-card-body">
        <slot></slot>
      </section>

      <!-- Footer -->
      <footer class="modal-card-foot">
        <slot name="buttons"></slot>
      </footer>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface DialogBaseProps {
  title: string;
  showClose?: boolean;
  visible?: boolean;
}

withDefaults(defineProps<DialogBaseProps>(), {
  showClose: true,
  visible: false,
});

defineEmits<{
  (e: 'close'): void;
}>();
</script>
