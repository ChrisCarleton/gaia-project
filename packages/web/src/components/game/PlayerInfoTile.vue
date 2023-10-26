<template>
  <div class="tile is-parent is-3">
    <div class="tile is-child card">
      <!-- Header -->
      <div class="card-header">
        <p class="card-header-title">{{ player.name }}</p>
        <div v-if="isActive" class="card-header-icon">
          <span class="tag is-success">Active Player</span>
        </div>
      </div>

      <!-- Content Body -->
      <div class="card-content content">
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

        <span class="heading">Resources</span>
        <div class="level">
          <div class="level-item icon-text">
            <abbr title="Credits">
              <span class="icon">
                <i class="fas fa-coins"></i>
              </span>
              <span class="is-family-code">{{ player.resources.credits }}</span>
            </abbr>
          </div>

          <div class="level-item icon-text">
            <abbr title="Knowledge">
              <span class="icon">
                <i class="fas fa-brain"></i>
              </span>
              <span class="is-family-code">{{
                player.resources.knowledge
              }}</span>
            </abbr>
          </div>

          <div class="level-item icon-text">
            <abbr title="Ore">
              <span class="icon">
                <i class="fas fa-mountain"></i>
              </span>
              <span class="is-family-code">{{ player.resources.ore }}</span>
            </abbr>
          </div>

          <div class="level-item icon-text">
            <abbr title="QIC">
              <span class="icon">
                <i class="fas fa-cube"></i>
              </span>
              <span class="is-family-code">{{ player.resources.qic }}</span>
            </abbr>
          </div>

          <div class="level-item icon-text">
            <abbr title="Victory Points">
              <span class="icon">
                <i class="fas fa-star"></i>
              </span>
              <span class="is-family-code">{{ player.vp }}</span>
            </abbr>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <!-- <footer v-if="isActive" class="card-footer">
        <a
          v-if="allowedActions.has(GameAction.BuildMine)"
          href="#"
          class="card-footer-item"
          @click="$emit('buildmine')"
        >
          Build Mine
        </a>

        <a
          v-if="allowedActions.has(GameAction.Pass)"
          href="#"
          class="card-footer-item"
          @click="$emit('pass')"
        >
          Pass
        </a>
      </footer> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FactionTypeNames, PlanetTypeNames } from '@/constants';
import { Player } from '@gaia-project/engine';
import { computed } from 'vue';

interface PlayerInfoTileProps {
  player: Player;
  isActive: boolean;
}

const props = defineProps<PlayerInfoTileProps>();
defineEmits<{
  (e: 'buildmine'): void;
  (e: 'pass'): void;
}>();

const factionName = computed(
  () => FactionTypeNames[props.player.faction.factionType],
);
const homeworldType = computed(
  () => PlanetTypeNames[props.player.faction.homeWorld],
);
</script>
