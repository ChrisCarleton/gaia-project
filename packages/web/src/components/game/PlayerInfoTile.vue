<template>
  <div class="tile is-child box">
    <div class="block">
      <p class="title">{{ player.name }}</p>
      <span class="heading">Faction</span>
      <span class="is-family-code">
        {{ factionName }}
      </span>
    </div>

    <div class="block">
      <span class="heading">Resources</span>
      <div class="level">
        <div class="level-item icon-text" aria-label="Credits">
          <span class="icon">
            <i class="fas fa-coins"></i>
          </span>
          <span class="is-family-code">{{ player.resources.credits }}</span>
        </div>

        <div class="level-item icon-text" aria-label="Knowledge">
          <span class="icon">
            <i class="fas fa-brain"></i>
          </span>
          <span class="is-family-code">{{ player.resources.knowledge }}</span>
        </div>

        <div class="level-item icon-text" aria-label="Ore">
          <span class="icon">
            <i class="fas fa-mountain"></i>
          </span>
          <span class="is-family-code">{{ player.resources.ore }}</span>
        </div>

        <div class="level-item icon-text" aria-label="QIC">
          <span class="icon">
            <i class="fas fa-cube"></i>
          </span>
          <span class="is-family-code">{{ player.resources.qic }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FactionTypeNames } from '@/constants';
import { Player } from '@gaia-project/engine';
import { computed } from 'vue';

interface PlayerInfoTileProps {
  player: Player;
}

const props = defineProps<PlayerInfoTileProps>();

const factionName = computed(
  () => FactionTypeNames[props.player.faction.factionType],
);
</script>
