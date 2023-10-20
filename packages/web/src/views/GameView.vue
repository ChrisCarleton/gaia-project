<template>
  <!-- <PageTitle title="Game Test" /> -->
  <section class="section">
    <div class="tile is-ancestor">
      <div class="tile is-parent is-12">
        <GameStatusTile
          :current-player="gameState.currentPlayer"
          :round="gameState.round"
        />
      </div>
    </div>
    <div class="tile is-ancestor">
      <div
        v-if="viewState === PlayerViewState.Players"
        class="tile is-parent is-vertical is-2"
      >
        <PlayerInfoTile
          v-for="player in game.context.players"
          :key="player.name"
          :player="player"
          :is-active="player.id === gameState.currentPlayer?.id"
          :allowed-actions="gameState.allowedActions"
          @buildmine="viewState = PlayerViewState.BuildFirstMine"
        />
        <MapInfoTile :highlighted-tile="currentHex" />
      </div>

      <div
        v-else-if="viewState === PlayerViewState.BuildFirstMine"
        class="tile is-parent is-2"
      >
        <BuildFirstMineTile @cancel="viewState = PlayerViewState.Players" />
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
import BuildFirstMineTile from '@/components/game/BuildFirstMineTile.vue';
import GameStatusTile from '@/components/game/GameStatusTile.vue';
import MapInfoTile from '@/components/game/MapInfoTile.vue';
import PlayerInfoTile from '@/components/game/PlayerInfoTile.vue';
import RenderWindow from '@/components/game/RenderWindow.vue';
import { EventType, GameAction, Observer, Player } from '@gaia-project/engine';
import {
  BasicMapModel,
  FactionFactory,
  FactionType,
  Game,
  MapHex,
  PlayerFactory,
} from '@gaia-project/engine';
import { reactive, ref } from 'vue';

enum PlayerViewState {
  Players,
  BuildFirstMine,
}

interface GameState {
  allowedActions: Set<GameAction>;
  currentPlayer?: Player;
  round: number;
}

const gameState = reactive<GameState>({
  allowedActions: new Set<GameAction>([]),
  round: 0,
});
const viewState = ref<PlayerViewState>(PlayerViewState.Players);

const currentHex = ref<MapHex | undefined>();
const events = new Observer();

events.subscribe(EventType.AwaitingPlayerInput, (e) => {
  if (e.type === EventType.AwaitingPlayerInput) {
    gameState.currentPlayer = e.player;
    gameState.allowedActions = new Set<GameAction>(e.allowedActions);
  }
});

const factionFactory = new FactionFactory();
const playerFactory = new PlayerFactory(events, factionFactory);
const players = [
  playerFactory.createPlayer('0', FactionType.Terrans, 'Julian'),
  playerFactory.createPlayer('1', FactionType.Ambas, 'Bubbles'),
  playerFactory.createPlayer('2', FactionType.BalTaks, 'Ricky'),
];

const map = new BasicMapModel().createMap(players.length);
const game = Game.beginNewGame(players, map, events);

function onHexHighlight(mapHex: MapHex) {
  currentHex.value = mapHex;
}

async function onHexClick(mapHex: MapHex): Promise<void> {
  // TODO: Handle this event.
}
</script>
