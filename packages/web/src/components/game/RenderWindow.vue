<template>
  <div id="render" ref="containerDiv"></div>
</template>

<script lang="ts" setup>
import { SceneRenderer } from '@/graphics';
import { HexHighlightStatus } from '@/graphics/map';
import { Game, MapHex, Player, StructureType } from '@gaia-project/engine';
import { WebGLRenderer } from 'three';
import { onMounted, ref } from 'vue';
import { map } from 'zod';

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
const renderer = ref<SceneRenderer | undefined>();

function onHexHighlight(mapHex: MapHex) {
  emit('hexhighlight', mapHex);
}

function onHexClick(mapHex: MapHex) {
  emit('hexclick', mapHex);
}

onMounted(() => {
  let width = 1920;
  if (containerDiv.value) {
    const boundingRect = containerDiv.value.getBoundingClientRect();
    const padding =
      parseInt(
        window
          .getComputedStyle(containerDiv.value, null)
          .getPropertyValue('padding-left'),
      ) +
      parseInt(
        window
          .getComputedStyle(containerDiv.value, null)
          .getPropertyValue('padding-right'),
      );
    width = boundingRect.width - padding;
  }
  const height = width * (9 / 16); // Go for a consistent 16:9 aspect ratio.

  const sceneRenderer = new SceneRenderer(
    webGL,
    {
      width,
      height,
    },
    props.game,
  );
  sceneRenderer.on('hexhighlight', onHexHighlight);
  sceneRenderer.on('hexclick', onHexClick);

  document.getElementById('render')?.appendChild(webGL.domElement);
  sceneRenderer.beginRendering();

  renderer.value = sceneRenderer;
});

function setHighlightStatus(status: HexHighlightStatus) {
  renderer.value?.setHighlightStatus(status);
}

function addStructure(
  mapHex: MapHex,
  player: Player,
  structureType: StructureType,
) {
  renderer.value?.addStructure(mapHex, player, structureType);
}

function removeStructure(mapHex: MapHex) {
  renderer.value?.removeStructure(mapHex);
}

defineExpose({
  addStructure,
  removeStructure,
  setHighlightStatus,
});
</script>
