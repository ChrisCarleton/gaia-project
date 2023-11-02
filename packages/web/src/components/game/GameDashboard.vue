<template>
  <GameEndedDialog
    :player-rankings="gameState.playerRankings"
    :visible="gameState.gameOver"
  />
  <ResearchDialog :player="gameState.currentPlayer" />
  <RoundBoostersDialog
    :boosters="gameState.roundBoosters"
    :visible="gameState.selectingRoundBooster"
    @cancel="gameState.selectingRoundBooster = false"
    @confirm="onSelectRoundBooster"
  />

  <SerializationDialog
    :game="currentGameSnapshot"
    :visible="gameState.showSerializationDialog"
    @close="gameState.showSerializationDialog = false"
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
          <ActionMenuTile
            :current-player="gameState.currentPlayer"
            :allowed-actions="gameState.allowedActions"
            @buildmine="
              gameState.menuPanelState = MenuPanelState.BuildFirstMine
            "
            @pass="onPass"
          />
        </div>

        <div class="tile is-parent">
          <div class="tile is-child box">
            <button
              class="button"
              @click="gameState.showSerializationDialog = true"
            >
              Serialize Game
            </button>
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
import GameEndedDialog from '@/components/dialog/GameEndedDialog.vue';
import ResearchDialog from '@/components/dialog/ResearchDialog.vue';
import RoundBoostersDialog from '@/components/dialog/RoundBoostersDialog.vue';
import SerializationDialog from '@/components/dialog/SerializationDialog.vue';
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
  LocalObserver,
  Observer,
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
import { SerializedGameContext } from '@gaia-project/engine/src/core/serialization';
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';

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
  showSerializationDialog: boolean;
}

const props = defineProps<GameDashboardProps>();

const store = useStore();
const events: Observer = new LocalObserver();
const factionFactory = new FactionFactory();
const playerFactory = new PlayerFactory(events, factionFactory);

const gameState = reactive<GameState>({
  allowedActions: new Set<GameAction>([]),
  gameOver: false,
  highlightStatus: HexHighlightStatus.Neutral,
  menuPanelState: MenuPanelState.Players,
  round: 0,
  roundBoosters: [],
  selectingRoundBooster: false,
  showSerializationDialog: false,
});

const renderWindow = ref<InstanceType<typeof RenderWindow> | null>();
const currentGameSnapshot = computed(() => store.state.currentGameSnapshot);
let game: Game | undefined;

function onHexHighlight(mapHex: MapHex) {
  if (!game) return;

  gameState.currentHex = mapHex;
  const status = HighlightStrategies[
    gameState.menuPanelState
  ].determineHighlight(
    gameState.currentPlayer ?? game.context.players[0],
    mapHex,
  );
  renderWindow.value?.setHighlightStatus(status);
}

async function onHexClick(mapHex: MapHex): Promise<void> {
  if (!game) return;

  gameState.currentHex = mapHex;
  try {
    await ClickStrategies[gameState.menuPanelState].handleClick(
      game,
      gameState.currentPlayer ?? game.context.players[0],
      mapHex,
    );
  } catch (error) {
    await store.dispatch(Action.ToastError, (error as Error).message);
  }
}

function onPass() {
  gameState.roundBoosters = game?.context.roundBoosters ?? [];
  gameState.selectingRoundBooster = true;
}

function onSelectRoundBooster(roundBooster: RoundBooster) {
  gameState.selectingRoundBooster = false;
  game?.chooseRoundBoosterAndPass(roundBooster);
}

function initGame(): void {
  // Unregister all prior listeners so we can re-use the observer.
  events.reset();

  if (props.context) {
    game = Game.resumeGame(props.context, playerFactory, events);
  } else {
    const players = [
      playerFactory.createPlayer('0', FactionType.Terrans, 'Julian'),
      playerFactory.createPlayer('1', FactionType.Ambas, 'Bubbles'),
      playerFactory.createPlayer('2', FactionType.BalTaks, 'Ricky'),
    ];

    const map = new BasicMapModel().createMap(players.length);
    game = Game.beginNewGame(players, map, events);
  }

  events.subscribe(EventType.AwaitingPlayerInput, (e) => {
    if (e.type === EventType.AwaitingPlayerInput) {
      gameState.currentPlayer = e.player;
      gameState.allowedActions = new Set<GameAction>(e.allowedActions);
      gameState.menuPanelState = MenuPanelState.Players;

      store.commit(Mutation.GameSnapshot, game!.serialize());
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
}

onMounted(initGame);
watch(props, () => {
  game = undefined;
  nextTick(initGame);
});
</script>
