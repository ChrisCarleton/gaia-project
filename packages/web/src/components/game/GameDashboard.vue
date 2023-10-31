<template>
  <GameEndedDialog
    :player-rankings="gameState.playerRankings"
    :visible="gameState.gameOver"
  />
  <RoundBoostersDialog
    :boosters="roundBoosters"
    :visible="gameState.selectingRoundBooster"
    @cancel="gameState.selectingRoundBooster = false"
    @confirm="onSelectRoundBooster"
  />

  <SerializationDialog
    :game="gameState.serializedGameState"
    :visible="showSerializationDialog"
    @close="showSerializationDialog = false"
  />
  <section class="section">
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <PlayerInfoTile
          v-for="player in game.context.players"
          :key="player.name"
          :player="player"
          :is-active="player.id === gameState.currentPlayer?.id"
        />
      </div>
    </div>
    <div class="tile is-ancestor">
      <div
        v-if="viewState === PlayerViewState.Players"
        class="tile is-parent is-vertical is-4"
      >
        <div class="tile is-parent">
          <ActionMenuTile
            :current-player="gameState.currentPlayer"
            :allowed-actions="gameState.allowedActions"
            @buildmine="viewState = PlayerViewState.BuildFirstMine"
            @pass="onPass"
          />
        </div>

        <div class="tile is-parent">
          <div class="tile is-child box">
            <button class="button" @click="showSerializationDialog = true">
              Serialize Game
            </button>
          </div>
        </div>
      </div>

      <div
        v-else-if="viewState === PlayerViewState.BuildFirstMine"
        class="tile is-parent is-4"
      >
        <BuildFirstMineTile
          :player="gameState.currentPlayer!"
          @cancel="viewState = PlayerViewState.Players"
        />
      </div>

      <div class="tile is-parent is-8">
        <RenderWindow
          ref="renderWindow"
          class="tile is-child box"
          :game="game"
          :highlight-status="highlightStatus"
          @hexhighlight="onHexHighlight"
          @hexclick="onHexClick"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import GameEndedDialog from '@/components/dialog/GameEndedDialog.vue';
import RoundBoostersDialog from '@/components/dialog/RoundBoostersDialog.vue';
import SerializationDialog from '@/components/dialog/SerializationDialog.vue';
import ActionMenuTile from '@/components/game/ActionMenuTile.vue';
import BuildFirstMineTile from '@/components/game/BuildFirstMineTile.vue';
import PlayerInfoTile from '@/components/game/PlayerInfoTile.vue';
import RenderWindow from '@/components/game/RenderWindow.vue';
import { HexHighlightStatus } from '@/graphics/map';
import { Action, useStore } from '@/store';
import {
  ClickStrategies,
  HighlightStrategies,
  PlayerViewState,
} from '@/strategies';
import {
  EventType,
  GameAction,
  LocalObserver,
  Player,
  RoundBooster,
  StructureType,
} from '@gaia-project/engine';
import {
  BasicMapModel,
  FactionFactory,
  FactionType,
  Game,
  MapHex,
  PlayerFactory,
} from '@gaia-project/engine';
import { computed, reactive, ref } from 'vue';

import SavedGameState from '../../views/game-context.json';

interface GameState {
  allowedActions: Set<GameAction>;
  currentPlayer?: Player;
  gameOver: boolean;
  playerRankings?: Readonly<Player[]>;
  round: number;
  selectingRoundBooster: boolean;
  serializedGameState: unknown;
}

const store = useStore();

const gameState = reactive<GameState>({
  allowedActions: new Set<GameAction>([]),
  gameOver: false,
  round: 0,
  selectingRoundBooster: false,
  serializedGameState: {},
});
const viewState = ref<PlayerViewState>(PlayerViewState.Players);
const highlightStatus = ref<HexHighlightStatus>(HexHighlightStatus.Neutral);
const renderWindow = ref<InstanceType<typeof RenderWindow> | null>();
const roundBoosters = computed(() => game.context.roundBoosters);

const currentHex = ref<MapHex | undefined>();
const showSerializationDialog = ref(false);
const events = new LocalObserver();

events.subscribe(EventType.AwaitingPlayerInput, (e) => {
  if (e.type === EventType.AwaitingPlayerInput) {
    gameState.currentPlayer = e.player;
    gameState.allowedActions = new Set<GameAction>(e.allowedActions);
    gameState.serializedGameState = game.serialize();
    viewState.value = PlayerViewState.Players;
  }
});

events.subscribe(EventType.MineBuilt, async (e) => {
  if (e.type === EventType.MineBuilt) {
    renderWindow.value?.addStructure(e.location, e.player, StructureType.Mine);
    await store.dispatch(
      Action.ToastSuccess,
      `${e.player.name} has built a mine.`,
    );
  }
});

events.subscribe(EventType.RoundBoosterSelected, async (e) => {
  if (e.type === EventType.RoundBoosterSelected) {
    await store.dispatch(
      Action.ToastSuccess,
      `${e.player.name} has selected a round booster.`,
    );
  }
});

events.subscribe(EventType.GameEnded, (e) => {
  if (e.type === EventType.GameEnded) {
    gameState.playerRankings = e.playerRanking;
    gameState.gameOver = true;
    viewState.value = PlayerViewState.Players;
  }
});

const factionFactory = new FactionFactory();
const playerFactory = new PlayerFactory(events, factionFactory);
// const players = [
//   playerFactory.createPlayer('0', FactionType.Terrans, 'Julian'),
//   playerFactory.createPlayer('1', FactionType.Ambas, 'Bubbles'),
//   playerFactory.createPlayer('2', FactionType.BalTaks, 'Ricky'),
// ];

// const map = new BasicMapModel().createMap(players.length);
// const game = Game.beginNewGame(players, map, events);

const game = Game.resumeGame(SavedGameState, playerFactory, events);

function onHexHighlight(mapHex: MapHex) {
  currentHex.value = mapHex;
  const status = HighlightStrategies[viewState.value].determineHighlight(
    gameState.currentPlayer ?? game.context.players[0],
    mapHex,
  );
  renderWindow.value?.setHighlightStatus(status);
}

async function onHexClick(mapHex: MapHex): Promise<void> {
  currentHex.value = mapHex;
  try {
    await ClickStrategies[viewState.value].handleClick(
      game,
      gameState.currentPlayer ?? game.context.players[0],
      mapHex,
    );
  } catch (error) {
    await store.dispatch(Action.ToastError, (error as Error).message);
  }
}

function onPass() {
  gameState.selectingRoundBooster = true;
}

function onSelectRoundBooster(roundBooster: RoundBooster) {
  gameState.selectingRoundBooster = false;
  game.chooseRoundBoosterAndPass(roundBooster);
}
</script>
