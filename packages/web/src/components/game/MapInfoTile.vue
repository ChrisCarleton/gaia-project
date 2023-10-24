<template>
  <div class="tile is-child box">
    <p class="block">
      <span class="heading">Location</span>
      <span v-if="highlightedTile">{{ highlightedTileCoords }}</span>
    </p>

    <p v-if="highlightedTile?.planet" class="block">
      <span class="heading">Planet</span>
      <span>{{ planetType }}</span>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { PlanetTypeNames } from '@/constants';
import { MapHex } from '@gaia-project/engine';
import { computed } from 'vue';

interface MapInfoTileProps {
  highlightedTile?: MapHex;
}

const props = defineProps<MapInfoTileProps>();

const highlightedTileCoords = computed(() => {
  if (!props.highlightedTile) return '';
  const [q, r] = props.highlightedTile.location;
  return `Q: ${q}, R: ${r}`;
});
const planetType = computed(() =>
  props.highlightedTile?.planet
    ? PlanetTypeNames[props.highlightedTile.planet]
    : '',
);
</script>
