<template>
  <div class="tooltip">
    <slot></slot>
    <span :class="tooltipClasses">{{ message }}</span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface ToolTipProps {
  message: string;
  position?: 'left' | 'right' | 'top' | 'bottom';
}

const props = withDefaults(defineProps<ToolTipProps>(), { position: 'top' });

const tooltipClasses = computed(
  () => `tooltip-text tooltip-${props.position} tag is-info`,
);
</script>

<style>
/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltip-text {
  visibility: hidden;

  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
}

.tooltip:hover .tooltip-text {
  visibility: visible;
}

.tooltip .tooltip-right {
  top: -5px;
  left: 85%;
}

.tooltip .tooltip-top {
  bottom: 100%;
  left: 50%;
  margin-left: -40px;
}

.tooltip .tooltip-bottom {
  top: 100%;
  left: 50%;
  margin-left: -40px;
}

.tooltip .tooltip-left {
  top: -5px;
  right: 85%;
}
</style>
