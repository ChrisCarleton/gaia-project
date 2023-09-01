<template>
  <div id="render"></div>
</template>

<script lang="ts" setup>
import { WebGLRenderer } from 'three';
import { onMounted } from 'vue';

import { RenderCallback, SceneRenderer } from '@/graphics';

interface RenderWindowProps {
  width: number;
  height: number;
  render: RenderCallback,
}

const props = withDefaults(
  defineProps<RenderWindowProps>(),
  {
    width: 800,
    height: 600,
  }
);
 
const webGL = new WebGLRenderer();
webGL.setSize(props.width, props.height);

const renderer = new SceneRenderer(webGL, props.render);

onMounted(() => {
  document.getElementById('render')?.appendChild(webGL.domElement);
  renderer.beginRendering();
});
</script>
