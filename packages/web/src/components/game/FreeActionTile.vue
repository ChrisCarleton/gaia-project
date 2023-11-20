<template>
  <ConfirmDialog
    v-if="dialogState.visible"
    @confirm="onConfirmAction"
    @cancel="onCancelAction"
  >
    <article class="media">
      <figure class="media-left">
        <span class="icon is-medium">
          <i class="fas fa-question fa-lg"></i>
        </span>
      </figure>
      <div class="media-content">
        <p class="content block">
          Are you sure you want to perform the following action?
        </p>
        <p class="content block is-family-code">
          Spend {{ dialogState.cost }} to receive {{ dialogState.value }}?
        </p>
      </div>
    </article>
  </ConfirmDialog>

  <div class="tile is-child card">
    <div class="card-header">
      <p class="card-header-title">Free Actions</p>

      <a href="#" class="card-header-icon" @click="$emit('cancel')">
        <span class="icon delete"></span>
      </a>
    </div>

    <div class="card-content">
      <div class="content block">
        Select a free action from the list below. Free actions are special in
        that you can perform as many as you like during your turn.
      </div>
      <div class="field is-grouped is-grouped-multiline">
        <div
          v-for="label in FreeActionLabels"
          :key="label.action"
          class="control"
        >
          <button
            class="button is-small is-ghost"
            :disabled="label.disabled()"
            @click="onSelectAction(label.action, label.cost, label.value)"
          >
            <span class="icon-text">
              <span>{{ label.cost }}</span>
              <span class="icon">
                <i class="far fa-arrow-alt-circle-right" aria-hidden="true"></i>
              </span>
              <span>{{ label.value }}</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FreeAction, PowerCycle, Resources } from '@gaia-project/engine';
import { computed, reactive } from 'vue';

import ConfirmDialog from '../dialog/ConfirmDialog.vue';

interface FreeActionsTileProps {
  resources: Resources;
  powerCycle: PowerCycle;
}

interface ConfirmDialogState {
  visible: boolean;
  action: FreeAction;
  cost: string;
  value: string;
}

const props = defineProps<FreeActionsTileProps>();
const dialogState = reactive<ConfirmDialogState>({
  action: FreeAction.GenerateCredit,
  cost: '',
  value: '',
  visible: false,
});
const chargedPower = computed(() =>
  props.powerCycle.brainStonePosition === 3
    ? props.powerCycle.level3 + 2
    : props.powerCycle.level3,
);

const FreeActionLabels: Readonly<
  { action: FreeAction; cost: string; value: string; disabled: () => boolean }[]
> = [
  {
    action: FreeAction.GenerateQIC,
    cost: '4 power',
    value: '1 QIC',
    disabled: () => chargedPower.value < 4,
  },
  {
    action: FreeAction.GenerateKnowledge,
    cost: '4 power',
    value: '1 knowledge',
    disabled: () => chargedPower.value < 4,
  },
  {
    action: FreeAction.GenerateOre,
    cost: '3 power',
    value: '1 ore',
    disabled: () => chargedPower.value < 3,
  },
  {
    action: FreeAction.GenerateCredit,
    cost: '1 power',
    value: '1 credit',
    disabled: () => chargedPower.value < 1,
  },
  {
    action: FreeAction.TradeKnowledgeForCredit,
    cost: '1 knowledge',
    value: '1 credit',
    disabled: () => props.resources.knowledge < 1,
  },
  {
    action: FreeAction.TradeOreForCredit,
    cost: '1 ore',
    value: '1 credit',
    disabled: () => props.resources.ore < 1,
  },
  {
    action: FreeAction.TradeOreForPowerNode,
    cost: '1 ore',
    value: '1 power node',
    disabled: () => props.resources.ore < 1,
  },
  {
    action: FreeAction.TradeQICForOre,
    cost: '1 QIC',
    value: '1 ore',
    disabled: () => props.resources.qic < 1,
  },
];

const emit = defineEmits<{
  (e: 'action', action: FreeAction): void;
  (e: 'cancel'): void;
}>();

function onSelectAction(action: FreeAction, cost: string, value: string) {
  dialogState.action = action;
  dialogState.cost = cost;
  dialogState.value = value;
  dialogState.visible = true;
}

function onConfirmAction() {
  dialogState.visible = false;
  emit('action', dialogState.action);
}

function onCancelAction() {
  dialogState.visible = false;
}
</script>
