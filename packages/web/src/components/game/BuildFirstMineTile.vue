<template>
  <div class="tile is-child card">
    <header class="card-header">
      <p class="card-header-title">Build First Mines</p>

      <a href="#" class="card-header-icon" @click="$emit('cancel')">
        <span class="icon delete"></span>
      </a>
    </header>

    <div class="card-content">
      <p class="content">
        Before the game begins, players need to place their first mines. Your
        first mines must be placed on planets matching your faction's homeworld.
        (No terraforming is allowed yet!)
      </p>

      <p class="content">These mines can be placed at no cost.</p>

      <div class="block level">
        <div class="level-item">
          <div>
            <p class="heading">Homeworld</p>
            <p class="is-family-code">
              {{ PlanetTypeNames[player.faction.homeWorld] }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PlanetTypeNames, Player } from '@gaia-project/engine';

interface BuildFirstMineTileProps {
  player: Player;
}

defineProps<BuildFirstMineTileProps>();

defineEmits<{
  (e: 'cancel'): void;
}>();
</script>
