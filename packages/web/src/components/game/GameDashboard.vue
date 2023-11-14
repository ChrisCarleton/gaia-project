<template>
  <GameEndedDialog
    :player-rankings="gameState.playerRankings"
    :visible="gameState.gameOver"
  />
  <ResearchDetails
    :visible="gameState.showResearch"
    :player="gameState.currentPlayer"
    @close="gameState.showResearch = false"
  />
  <RoundBoosterDetails
    :boosters="gameState.roundBoosters"
    :visible="gameState.selectingRoundBooster"
    @cancel="gameState.selectingRoundBooster = false"
    @confirm="onSelectRoundBooster"
  />

  <section v-if="game" class="section">
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
        v-if="gameState.menuPanelState === MenuPanelState.Players"
        class="tile is-parent is-vertical is-4"
      >
        <div class="tile is-parent">
          <GameStatusTile
            :current-player="gameState.currentPlayer"
            :round="gameState.round"
          />
        </div>
        <div class="tile is-parent">
          <ActionMenuTile
            :current-player="gameState.currentPlayer"
            :allowed-actions="gameState.allowedActions"
            @buildmine="
              gameState.menuPanelState = MenuPanelState.BuildFirstMine
            "
            @pass="onPass"
            @research="onResearch"
          />
        </div>

        <div class="tile is-parent">
          <div class="tile is-child box">
            <div class="field is-grouped">
              <div class="control">
                <button class="button" @click="serializeGame">
                  Serialize Game
                </button>
              </div>
              <div v-if="showCopied" class="control">
                <span class="tag is-success"> ✔️ Copied! </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else-if="gameState.menuPanelState === MenuPanelState.BuildFirstMine"
        class="tile is-parent is-4"
      >
        <BuildFirstMineTile
          :player="gameState.currentPlayer!"
          @cancel="gameState.menuPanelState = MenuPanelState.Players"
        />
      </div>

      <div class="tile is-parent is-8">
        <RenderWindow
          ref="renderWindow"
          class="tile is-child box"
          :game="game"
          :highlight-status="gameState.highlightStatus"
          @hexhighlight="onHexHighlight"
          @hexclick="onHexClick"
        />
      </div>
    </div>
  </section>

  <section v-else class="section">
    <!-- TODO: Game not initialized yet (or being re-initialized). -->
  </section>
</template>

<script lang="ts" setup>
import ResearchDetails from '@/components/details/ResearchDetails.vue';
import GameEndedDialog from '@/components/dialog/GameEndedDialog.vue';
import ActionMenuTile from '@/components/game/ActionMenuTile.vue';
import BuildFirstMineTile from '@/components/game/BuildFirstMineTile.vue';
import PlayerInfoTile from '@/components/game/PlayerInfoTile.vue';
import RenderWindow from '@/components/game/RenderWindow.vue';
import { HexHighlightStatus } from '@/graphics/map';
import { Action, Mutation, useStore } from '@/store';
import {
  ClickStrategies,
  HighlightStrategies,
  MenuPanelState,
} from '@/strategies';
import {
  EventType,
  GameAction,
  Player,
  RoundBooster,
  StructureType,
} from '@gaia-project/engine';
import { BasicMapModel, FactionType, Game, MapHex } from '@gaia-project/engine';
import { SerializedGameContext } from '@gaia-project/engine/src/core/serialization';
import { nextTick, onMounted, reactive, ref, watch } from 'vue';

import RoundBoosterDetails from '../details/RoundBoosterDetails.vue';
import GameStatusTile from './GameStatusTile.vue';

interface GameDashboardProps {
  context: SerializedGameContext | undefined;
}

interface GameState {
  allowedActions: Set<GameAction>;
  currentHex?: MapHex;
  currentPlayer?: Player;
  gameOver: boolean;
  highlightStatus: HexHighlightStatus;
  menuPanelState: MenuPanelState;
  playerRankings?: Readonly<Player[]>;
  round: number;
  roundBoosters: Readonly<RoundBooster[]>;
  selectingRoundBooster: boolean;
  showResearch: boolean;
}

const props = defineProps<GameDashboardProps>();

const store = useStore();
const gameState = reactive<GameState>({
  allowedActions: new Set<GameAction>([]),
  gameOver: false,
  highlightStatus: HexHighlightStatus.Neutral,
  menuPanelState: MenuPanelState.Players,
  round: 0,
  roundBoosters: [],
  selectingRoundBooster: false,
  showResearch: false,
});

const renderWindow = ref<InstanceType<typeof RenderWindow> | null>();
const showCopied = ref(false);
const game = ref<Game | undefined>();

function onHexHighlight(mapHex: MapHex) {
  if (!game.value) return;

  gameState.currentHex = mapHex;
  const status = HighlightStrategies[
    gameState.menuPanelState
  ].determineHighlight(
    gameState.currentPlayer ?? game.value.context.players[0],
    mapHex,
  );
  renderWindow.value?.setHighlightStatus(status);
}

async function onHexClick(mapHex: MapHex): Promise<void> {
  if (!game.value) return;

  gameState.currentHex = mapHex;
  try {
    await ClickStrategies[gameState.menuPanelState].handleClick(
      game.value,
      gameState.currentPlayer ?? game.value.context.players[0],
      mapHex,
    );
  } catch (error) {
    await store.dispatch(Action.ToastError, (error as Error).message);
  }
}

function onPass() {
  gameState.roundBoosters = game.value?.context.roundBoosters ?? [];
  gameState.selectingRoundBooster = true;
}

function onSelectRoundBooster(roundBooster: RoundBooster) {
  gameState.selectingRoundBooster = false;
  game.value?.chooseRoundBoosterAndPass(roundBooster);
}

function onResearch(): void {
  gameState.showResearch = true;
}

function serializeGame(): void {
  navigator.clipboard.writeText(JSON.stringify(game, null, 2));
  showCopied.value = true;
  setTimeout(() => (showCopied.value = false), 2500);
}

function initGame(): void {
  game.value = new Game();
  const { events } = game.value;

  events.subscribe(EventType.AwaitingPlayerInput, (e) => {
    if (e.type === EventType.AwaitingPlayerInput) {
      gameState.currentPlayer = e.player;
      gameState.allowedActions = new Set<GameAction>(e.allowedActions);
      gameState.menuPanelState = MenuPanelState.Players;

      store.commit(Mutation.GameSnapshot, game.value?.serialize());
    }
  });

  events.subscribe(EventType.BeginRound, (e) => {
    if (e.type === EventType.BeginRound) {
      gameState.round = e.round;
    }
  });

  events.subscribe(EventType.MineBuilt, async (e) => {
    if (e.type === EventType.MineBuilt) {
      renderWindow.value?.addStructure(
        e.location,
        e.player,
        StructureType.Mine,
      );
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
      gameState.menuPanelState = MenuPanelState.Players;
    }
  });

  if (props.context) {
    game.value.reloadGame(props.context);
  } else {
    const players = [
      { id: '0', faction: FactionType.Terrans, name: 'Julian' },
      { id: '1', faction: FactionType.Ambas, name: 'Bubbles' },
      { id: '2', faction: FactionType.BalTaks, name: 'Ricky' },
    ];

    game.value.beginGame(players, new BasicMapModel());
  }
}

onMounted(initGame);
watch(props, () => {
  game.value = undefined;
  nextTick(initGame);
});
</script>
