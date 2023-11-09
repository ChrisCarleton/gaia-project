<template>
  <div class="level-item">
    <div class="has-text-centered">
      <p class="heading">{{ heading }}</p>
      <p class="is-family-code">{{ stat }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface StatWithHeadingProps {
  heading: string;
  stat: string | number;
}

defineProps<StatWithHeadingProps>();
</script>
