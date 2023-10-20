<template>
  <div class="tile is-child box">
    <div class="block">
      <p class="title">{{ player.name }}</p>
      <span v-if="isActive" class="tag is-success">Go!</span>
      <span class="heading">Faction</span>
      <span class="is-family-code">
        {{ factionName }}
      </span>
    </div>

    <div class="block">
      <span class="heading">Resources</span>
      <div class="level">
        <ToolTip
          message="Credits"
          class="level-item icon-text"
          aria-label="Credits"
        >
          <span class="icon">
            <i class="fas fa-coins"></i>
          </span>
          <span class="is-family-code">{{ player.resources.credits }}</span>
        </ToolTip>

        <ToolTip
          message="Knowledge"
          class="level-item icon-text"
          aria-label="Knowledge"
        >
          <span class="icon">
            <i class="fas fa-brain"></i>
          </span>
          <span class="is-family-code">{{ player.resources.knowledge }}</span>
        </ToolTip>

        <ToolTip message="Ore" class="level-item icon-text" aria-label="Ore">
          <span class="icon">
            <i class="fas fa-mountain"></i>
          </span>
          <span class="is-family-code">{{ player.resources.ore }}</span>
        </ToolTip>

        <ToolTip message="QIC" class="level-item icon-text" aria-label="QIC">
          <span class="icon">
            <i class="fas fa-cube"></i>
          </span>
          <span class="is-family-code">{{ player.resources.qic }}</span>
        </ToolTip>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ToolTip from '@/components/ToolTip.vue';
import { FactionTypeNames } from '@/constants';
import { GameContext, Player } from '@gaia-project/engine';
import { computed } from 'vue';

interface PlayerInfoTileProps {
  player: Player;
  context: GameContext;
}

const props = defineProps<PlayerInfoTileProps>();

const factionName = computed(
  () => FactionTypeNames[props.player.faction.factionType],
);
const isActive = computed(
  () => props.context.currentPlayer?.id === props.player.id,
);
</script>
