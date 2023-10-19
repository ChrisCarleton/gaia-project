<template>
  <div class="tooltip">
    <slot></slot>
    <span class="tooltiptext tag">{{ message }}</span>
  </div>
</template>

<script lang="ts" setup>
interface ToolTipProps {
  message: string;
}

defineProps<ToolTipProps>();
</script>

<style>
/* Tooltip container */
.tooltip {
  display: inline-block;
}

/* Tooltip text */
.tooltip .tooltiptext {
  position: relative;
  visibility: hidden;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
