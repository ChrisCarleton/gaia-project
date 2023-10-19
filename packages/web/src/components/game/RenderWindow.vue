<template>
  <div id="render" ref="containerDiv"></div>
</template>

<script lang="ts" setup>
import { SceneRenderer } from '@/graphics';
import { Game, MapHex } from '@gaia-project/engine';
import { WebGLRenderer } from 'three';
import { onMounted, ref } from 'vue';

interface RenderWindowProps {
  game: Game;
}

const props = defineProps<RenderWindowProps>();
const emit = defineEmits<{
  (e: 'hexhighlight', mapHex: MapHex): void;
  (e: 'hexclick', mapHex: MapHex): void;
}>();

const webGL = new WebGLRenderer();
const containerDiv = ref<HTMLDivElement | null>();

function onHexHighlight(mapHex: MapHex) {
  emit('hexhighlight', mapHex);
}

function onHexClick(mapHex: MapHex) {
  emit('hexclick', mapHex);
}

onMounted(() => {
  const boundingRect = containerDiv.value?.getBoundingClientRect();
  const width = boundingRect?.width ?? 1920;
  const height = width * (9 / 16); // Go for a consistent 16:9 aspect ratio.

  const renderer = new SceneRenderer(
    webGL,
    {
      width,
      height,
    },
    props.game,
  );
  renderer.on('hexhighlight', onHexHighlight);
  renderer.on('hexclick', onHexClick);

  document.getElementById('render')?.appendChild(webGL.domElement);
  renderer.beginRendering();
});
</script>
