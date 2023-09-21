<template>
  <section class="hero">
    <div class="hero-body">
      <div class="container">
        <p class="title">{{ title }}</p>
        <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
        <slot></slot>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
interface PageTitleProps {
  title: string;
  subtitle?: string;
}

defineProps<PageTitleProps>();
</script>
