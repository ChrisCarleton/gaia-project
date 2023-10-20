<template>
  <div class="tile is-child card is-success">
    <!-- Header -->
    <div class="card-header">
      <p class="card-header-title is-centered">{{ player.name }}</p>
    </div>

    <!-- Content Body -->
    <div class="card-content content">
      <div v-if="isActive" class="block content has-text-centered">
        <span class="tag is-success">Active Player</span>
      </div>

      <div class="block">
        <div class="level">
          <div class="level-left">
            <div class="level-item">
              <div>
                <span class="heading">Faction</span>
                <span class="is-family-code">
                  {{ factionName }}
                </span>
              </div>
            </div>
          </div>

          <div class="level-right">
            <div class="level-item">
              <div>
                <span class="heading">Homeworld</span>
                <span class="is-family-code"> {{ homeworldType }} </span>
              </div>
            </div>
          </div>
        </div>
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

    <!-- Footer -->
    <footer v-if="isActive" class="card-footer">
      <a
        v-if="allowedActions.has(GameAction.BuildMine)"
        href="#"
        class="card-footer-item"
        @click="$emit('buildmine')"
      >
        Build Mine
      </a>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import ToolTip from '@/components/ToolTip.vue';
import { FactionTypeNames, PlanetTypeNames } from '@/constants';
import { GameAction, Player } from '@gaia-project/engine';
import { computed } from 'vue';

interface PlayerInfoTileProps {
  player: Player;
  isActive: boolean;
  allowedActions: Set<GameAction>;
}

const props = defineProps<PlayerInfoTileProps>();
defineEmits<{
  (e: 'buildmine'): void;
}>();

const factionName = computed(
  () => FactionTypeNames[props.player.faction.factionType],
);
const homeworldType = computed(
  () => PlanetTypeNames[props.player.faction.homeWorld],
);
</script>
