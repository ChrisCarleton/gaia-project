<template>
  <div class="modal is-active">
    <div class="modal-background" @click="onBackgroundClick"></div>
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
        <div class="buttons is-text-right">
          <slot name="buttons"></slot>
        </div>
      </footer>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface DialogBaseProps {
  title: string;
  showClose?: boolean;
}

const props = withDefaults(defineProps<DialogBaseProps>(), {
  showClose: true,
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

function onBackgroundClick() {
  if (props.showClose) {
    emit('close');
  }
}
</script>
