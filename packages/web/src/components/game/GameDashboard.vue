<template>
  <GameEndedDialog
    :player-rankings="dashboardState.playerRankings"
    :visible="dashboardState.gameOver"
  />
  <ResearchDetails
    :visible="dashboardState.showResearch"
    :player="currentPlayer"
    @close="dashboardState.showResearch = false"
  />
  <RoundBoosterDetails
    :boosters="dashboardState.roundBoosters"
    :visible="dashboardState.selectingRoundBooster"
    @cancel="dashboardState.selectingRoundBooster = false"
    @confirm="onSelectRoundBooster"
  />

  <section v-if="gameContext && game && currentPlayer" class="section">
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <PlayerInfoTile
          v-for="player in players"
          :key="player.name"
          :player="player"
          :is-active="player.id === currentPlayer.id"
        />
      </div>
    </div>
    <div class="tile is-ancestor">
      <div
        v-if="dashboardState.menuPanelState === MenuPanelState.Players"
        class="tile is-parent is-vertical is-4"
      >
        <div class="tile is-parent">
          <GameStatusTile
            :current-player="currentPlayer"
            :round="gameContext.currentRound"
          />
        </div>
        <div class="tile is-parent">
          <ActionMenuTile
            :current-player="currentPlayer"
            :allowed-actions="dashboardState.allowedActions"
            @buildmine="
              dashboardState.menuPanelState = MenuPanelState.BuildFirstMine
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
        v-else-if="
          dashboardState.menuPanelState === MenuPanelState.BuildFirstMine
        "
        class="tile is-parent is-4"
      >
        <BuildFirstMineTile
          :player="currentPlayer"
          @cancel="dashboardState.menuPanelState = MenuPanelState.Players"
        />
      </div>

      <div class="tile is-parent is-8">
        <RenderWindow
          ref="renderWindow"
          class="tile is-child box"
          :game="game"
          :highlight-status="dashboardState.highlightStatus"
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
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';

import RoundBoosterDetails from '../details/RoundBoosterDetails.vue';
import GameStatusTile from './GameStatusTile.vue';

interface GameDashboardProps {
  context: SerializedGameContext | undefined;
}

interface DashboardState {
  allowedActions: Set<GameAction>;
  currentHex?: MapHex;
  gameOver: boolean;
  highlightStatus: HexHighlightStatus;
  menuPanelState: MenuPanelState;
  playerRankings?: Readonly<Player[]>;
  roundBoosters: Readonly<RoundBooster[]>;
  selectingRoundBooster: boolean;
  showResearch: boolean;
}

const props = defineProps<GameDashboardProps>();

const store = useStore();
const dashboardState = reactive<DashboardState>({
  allowedActions: new Set<GameAction>([]),
  gameOver: false,
  highlightStatus: HexHighlightStatus.Neutral,
  menuPanelState: MenuPanelState.Players,
  roundBoosters: [],
  selectingRoundBooster: false,
  showResearch: false,
});
const gameContext = computed(() => store.state.gameState);
const players = computed(() => store.state.players);
const currentPlayer = computed(() =>
  typeof store.state.gameState?.currentPlayer === 'number'
    ? store.state.players[store.state.gameState.currentPlayer]
    : undefined,
);

const renderWindow = ref<InstanceType<typeof RenderWindow> | null>();
const showCopied = ref(false);
let game: Game | undefined;

function onHexHighlight(mapHex: MapHex) {
  if (!game) return;

  dashboardState.currentHex = mapHex;
  const status = HighlightStrategies[
    dashboardState.menuPanelState
  ].determineHighlight(
    game.context.currentPlayer ?? game.context.players[0],
    mapHex,
  );
  renderWindow.value?.setHighlightStatus(status);
}

async function onHexClick(mapHex: MapHex): Promise<void> {
  if (!game) return;

  dashboardState.currentHex = mapHex;
  try {
    await ClickStrategies[dashboardState.menuPanelState].handleClick(
      game,
      game.context.currentPlayer ?? game.context.players[0],
      mapHex,
    );
  } catch (error) {
    await store.dispatch(Action.ToastError, (error as Error).message);
  }
}

function onPass() {
  dashboardState.roundBoosters = game?.context.roundBoosters ?? [];
  dashboardState.selectingRoundBooster = true;
}

function onSelectRoundBooster(roundBooster: RoundBooster) {
  dashboardState.selectingRoundBooster = false;
  game?.pass(roundBooster);
}

function onResearch(): void {
  dashboardState.showResearch = true;
}

function serializeGame(): void {
  navigator.clipboard.writeText(JSON.stringify(game?.serialize(), null, 2));
  showCopied.value = true;
  setTimeout(() => (showCopied.value = false), 2500);
}

function initGame(): void {
  game = new Game();
  const { events } = game;

  Object.values(EventType).forEach((type) => {
    events.subscribe(type, (e) =>
      store.dispatch(Action.HandleGameEvent, { e, game }),
    );
  });

  events.subscribe(EventType.AwaitingPlayerInput, (e) => {
    if (e.type === EventType.AwaitingPlayerInput) {
      dashboardState.allowedActions = new Set<GameAction>(e.allowedActions);

      if (
        dashboardState.allowedActions.size === 1 &&
        dashboardState.allowedActions.has(GameAction.BuildMine)
      ) {
        dashboardState.menuPanelState = MenuPanelState.BuildFirstMine;
      } else {
        dashboardState.menuPanelState = MenuPanelState.Players;
      }
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
      dashboardState.playerRankings = e.playerRanking;
      dashboardState.gameOver = true;
      dashboardState.menuPanelState = MenuPanelState.Players;
    }
  });

  if (props.context) {
    game?.reloadGame(props.context);
  } else {
    const players = [
      { id: '0', faction: FactionType.Terrans, name: 'Julian' },
      { id: '1', faction: FactionType.Ambas, name: 'Bubbles' },
      { id: '2', faction: FactionType.BalTaks, name: 'Ricky' },
    ];

    game?.beginGame(players, new BasicMapModel());
  }

  store.dispatch(Action.InitGame, game);
}

onMounted(initGame);
watch(props, () => {
  game = undefined;
  nextTick(initGame);
});
</script>
