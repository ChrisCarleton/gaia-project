<template>
  <div id="render"></div>
</template>

<script lang="ts" setup>
import { SceneRenderer } from '@/graphics';
import { WebGLRenderer } from 'three';
import { onMounted } from 'vue';

interface RenderWindowProps {
  width: number;
  height: number;
}

const props = withDefaults(defineProps<RenderWindowProps>(), {
  width: 1920,
  height: 1080,
});

const webGL = new WebGLRenderer();
webGL.setSize(props.width, props.height);

const renderer = new SceneRenderer(webGL, {
  width: props.width,
  height: props.height,
});

onMounted(() => {
  document.getElementById('render')?.appendChild(webGL.domElement);
  renderer.beginRendering();
});
</script>
