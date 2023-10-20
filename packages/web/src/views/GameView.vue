<template>
  <!-- <PageTitle title="Game Test" /> -->
  <section class="section">
    <div class="tile is-ancestor">
      <div class="tile is-parent is-12">
        <GameStatusTile :context="game.context" />
      </div>
    </div>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-vertical is-2">
        <MapInfoTile :highlighted-tile="currentHex" />
        <PlayerInfoTile
          v-for="player in game.context.players"
          :key="player.name"
          :player="player"
          :context="game.context"
        />
      </div>
      <div class="tile is-parent is-10">
        <RenderWindow
          class="tile is-child box"
          :game="game"
          @hexhighlight="onHexHighlight"
          @hexclick="onHexClick"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import GameStatusTile from '@/components/game/GameStatusTile.vue';
import MapInfoTile from '@/components/game/MapInfoTile.vue';
import PlayerInfoTile from '@/components/game/PlayerInfoTile.vue';
import RenderWindow from '@/components/game/RenderWindow.vue';
import { Observer } from '@gaia-project/engine';
import {
  BasicMapModel,
  FactionFactory,
  FactionType,
  Game,
  MapHex,
  PlayerFactory,
} from '@gaia-project/engine';
import { ref } from 'vue';

const currentHex = ref<MapHex | undefined>();
const events = new Observer();

const factionFactory = new FactionFactory();
const playerFactory = new PlayerFactory(events, factionFactory);
const players = [
  playerFactory.createPlayer('0', FactionType.Terrans, 'Julian'),
  playerFactory.createPlayer('1', FactionType.Ambas, 'Bubbles'),
  playerFactory.createPlayer('2', FactionType.BalTaks, 'Ricky'),
];

const mapModel = new BasicMapModel();
const game = new Game(players, mapModel, events);

function onHexHighlight(mapHex: MapHex) {
  currentHex.value = mapHex;
}

async function onHexClick(mapHex: MapHex): Promise<void> {
  // TODO: Handle this event.
}
</script>
