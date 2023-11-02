<template>
  <DialogBase
    title="Research"
    :visible="visible && !!player"
    @close="$emit('close')"
  >
    <template #default>
      <div v-if="player">
        <div v-for="area in ResearchAreas" :key="area" class="field">
          <label class="label">{{ ResearchAreaNames[area] }}</label>
          <div class="field is-grouped">
            <div class="control">
              <label class="label">{{ player.research[area] }} / 5</label>
            </div>

            <div class="control is-expanded">
              <progress
                class="progress is-large"
                max="5"
                :value="player.research[area]"
              >
                {{ player.research[area] }}
              </progress>
            </div>

            <div v-if="data.confirmArea === undefined" class="control">
              <button
                class="button is-ghost is-small"
                :disabled="!hasSufficientKnowledge"
                @click="() => onResearchClicked(area)"
              >
                +1
              </button>
            </div>

            <div v-if="data.confirmArea === area" class="control">
              <button
                class="button is-success is-small"
                title="Spend 4 knowledge and upgrade"
                :disabled="!hasSufficientKnowledge"
                @click="() => onConfirmResearch(area)"
              >
                ✔️
              </button>
            </div>

            <div v-if="data.confirmArea === area" class="control">
              <button
                class="button is-danger is-small"
                :disabled="!hasSufficientKnowledge"
                @click="onCancelResearch"
              >
                ❌
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #buttons>
      <button class="button is-primary" @click="$emit('close')">Done</button>

      <div class="field is-horizontal">
        <div class="field-label">
          <label class="label">Knowledge:</label>
        </div>
        <div class="field-body">
          <div
            :class="`control has-text-${
              hasSufficientKnowledge ? 'success' : 'danger'
            }`"
          >
            <span>{{ knowledge }} / 4</span>
          </div>
        </div>
      </div>
    </template>
  </DialogBase>
</template>

<script lang="ts" setup>
import DialogBase from '@/components/dialog/DialogBase.vue';
import { ResearchAreaNames } from '@/constants';
import { Player, ResearchArea } from '@gaia-project/engine';
import { computed, reactive } from 'vue';

interface ResearchDialogProps {
  player: Player | undefined;
  visible?: boolean;
}

interface ResearchDialogData {
  confirmArea: ResearchArea | undefined;
}

const ResearchAreas = Object.values(ResearchArea);

const props = withDefaults(defineProps<ResearchDialogProps>(), {
  visible: true,
});

const data = reactive<ResearchDialogData>({
  confirmArea: undefined,
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'research', area: ResearchArea): void;
}>();

const knowledge = computed(() => props.player?.resources.knowledge ?? 0);
const hasSufficientKnowledge = computed(() => knowledge.value >= 1);

function onResearchClicked(area: ResearchArea): void {
  data.confirmArea = area;
}

function onConfirmResearch(area: ResearchArea): void {
  data.confirmArea = undefined;
  emit('research', area);
}

function onCancelResearch(): void {
  data.confirmArea = undefined;
}
</script>
