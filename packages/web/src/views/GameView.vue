<template>
  <!-- <PageTitle title="Game Test" /> -->
  <section class="section">
    <div class="tile is-ancestor">
      <div class="tile is-parent is-vertical is-2">
        <MapInfoTile :highlighted-tile="currentHex" />
        <PlayerInfoTile
          v-for="player in game.context.players"
          :key="player.name"
          :player="player"
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
  playerFactory.createPlayer(FactionType.Terrans, 'Julian'),
  playerFactory.createPlayer(FactionType.Ambas, 'Bubbles'),
  playerFactory.createPlayer(FactionType.BalTaks, 'Ricky'),
];

const mapModel = new BasicMapModel();
const game = new Game(players, mapModel, events);

function onHexHighlight(mapHex: MapHex) {
  currentHex.value = mapHex;
}

async function onHexClick(mapHex: MapHex): Promise<void> {
  // TODO: Handle this event.
  const [q, r] = mapHex.location;
}
</script>
