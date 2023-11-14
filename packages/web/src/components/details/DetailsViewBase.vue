<template>
  <div v-if="visible" class="details-container" @click="$emit('close')"></div>
  <Transition name="slide">
    <div v-if="visible" class="details-panel">
      <div class="card details-content">
        <div class="card-header">
          <p class="card-header-title">{{ title }}</p>
          <p class="card-header-icon">
            <button
              class="delete"
              aria-label="close"
              @click="$emit('close')"
            ></button>
          </p>
        </div>

        <div class="card-content">
          <slot></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
interface DetailsViewProps {
  title: string;
  visible?: boolean;
}

withDefaults(defineProps<DetailsViewProps>(), {
  visible: true,
});

defineEmits<{
  (e: 'close'): void;
}>();
</script>

<style>
.details-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 500;
  background-color: rgba(10, 10, 10, 0.6);
  display: flex;
}

.details-panel {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1000;
  width: 50%;
}

.details-content {
  height: 100%;
}

.slide-enter-active,
.slide-leave-active {
  transition:
    left 0.5s ease,
    opacity 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
  left: -50%;
  opacity: 0;
}
</style>
