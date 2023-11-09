<template>
  <DetailsViewBase title="Research" :visible="visible" @close="$emit('close')">
    <div v-if="player">
      <div class="box content block">
        <div class="field is-horizontal">
          <div class="field-label">
            <label class="label is-normal">Knowledge:</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <span
                  :class="`is-family-code ${
                    hasSufficientKnowledge
                      ? 'has-text-success'
                      : 'has-text-danger'
                  }`"
                >
                  {{ player.resources.knowledge }} / 4
                </span>
                <span class="help is-danger">
                  Insufficient knowledge! You must have at least 4 knowledge to
                  advance your research.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
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
              class="button is-primary is-small"
              :disabled="!hasSufficientKnowledge"
              @click="() => onResearchClicked(area)"
            >
              +1
            </button>
          </div>

          <div v-if="data.confirmArea === undefined" class="control">
            <button
              class="button is-ghost is-small"
              @click="toggleExpandedInfo(area)"
            >
              ...
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

        <article v-if="data.expandedArea === area" class="message is-small">
          <div class="message-body">
            <table class="table is-narrow is-hoverable is-striped">
              <thead>
                <th>Level</th>
                <th>Description</th>
              </thead>
              <tbody>
                <tr
                  v-for="(description, index) in ResearchAreaDescriptions[area]"
                  :key="index"
                >
                  <td class="has-text-right">
                    <strong>{{ index }}</strong>
                  </td>
                  <td
                    v-if="index === player.research[area]"
                    class="has-text-warning"
                  >
                    <strong>{{ description }}</strong>
                  </td>
                  <td v-else-if="index < player.research[area]">
                    <s>{{ description }}</s>
                  </td>
                  <td v-else>
                    {{ description }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </div>
  </DetailsViewBase>
</template>

<script lang="ts" setup>
import { Player, ResearchArea, ResearchAreaNames } from '@gaia-project/engine';
import { computed, reactive } from 'vue';

import DetailsViewBase from './DetailsViewBase.vue';

interface ResearchDialogProps {
  player: Player | undefined;
  visible?: boolean;
}

interface ResearchDialogData {
  confirmArea: ResearchArea | undefined;
  expandedArea: ResearchArea | undefined;
}

const ResearchAreaDescriptions: Record<ResearchArea, readonly string[]> = {
  [ResearchArea.AI]: [
    'This level has no effect.',
    'Immediately gain one Q.I.C.',
    'Immediately gain one Q.I.C.',
    'Immediately gain two Q.I.C.',
    'Immediately gain two Q.I.C.',
    'Immediately gain four Q.I.C.',
  ],
  [ResearchArea.Economics]: [
    'This level has no effect.',
    'During each income phase, gain two credits and charge one power.',
    'During each income phase, gain one ore, two credits, and charge two power.',
    'During each income phase, gain one ore, three credits, and charge three power.',
    'During each income phase, gain two ore, four credits, and charge four power.',
    'Immediately gain three ore, six credits, and charge six power. Remember that you no longer receive the income from level 4.',
  ],
  [ResearchArea.Gaia]: [
    'This level has no effect. You cannot start a Gaia Project.',
    'To start a Gaia project, you must move six power tokens to your Gaia area. Immediately gain one of your Gaiaformers.',
    'To start a Gaia project, you must move six power tokens to your Gaia area. Immediately gain three power tokens.',
    'To start a Gaia project, you must move four power tokens to your Gaia area. Immediately gain one of your Gaiaformers.',
    'To start a Gaia project, you must move three power tokens to your Gaia area. Immediately gain one of your Gaiaformers.',
    'To start a Gaia project, you must move three power tokens to your Gaia area. Immediately gain 4 VP and 1 additional VP for each Gaia Planet with one of your structures on it (you do not gain VP for Gaiaformers on Gaia Planets)',
  ],
  [ResearchArea.Navigation]: [
    'Your basic range is one.',
    'Your basic range is one. Immediately gain one Q.I.C.',
    'Your basic range is two.',
    'Your basic range is two. Immediately gain one Q.I.C.',
    'Your basic range is three.',
    `
Your basic range is four. Immediately place the Lost Planet token on an accessible space that does not contain a planet,
satellite, or space station. The accessibility of a space follows the same rules as the “Build a Mine” action. This counts
as a “Build a Mine” action, meaning you can gain VP and your opponents can gain power. Do not place a mine on the Lost Planet
token. You are considered to have colonized the planet; place one of your satellites on the Lost Planet token as a reminder.
The Lost Planet counts as its own planet type, and as a planet with a mine. You cannot upgrade this mine.`,
  ],
  [ResearchArea.Science]: [
    'This level has no effect.',
    'During each income phase, gain one knowledge.',
    'During each income phase, gain two knowledge.',
    'During each income phase, gain three knowledge.',
    'During each income phase, gain four knowledge.',
    'Immediately gain nine knowledge. Remember that you no longer receive the income from level 4.',
  ],
  [ResearchArea.Terraforming]: [
    'Each terraforming step costs you three ore.',
    'Each terraforming step costs you three ore. Immediately gain two ore.',
    'Each terraforming step costs you two ore.',
    'Each terraforming step costs you one ore.',
    'Each terraforming step costs you one ore. Immediately gain two ore.',
    'Each terraforming step costs you one ore. Immediately gain the federation token placed here. Gaining this federation token counts as “Forming an Federation.” Remember that you must have a previously acquired federation token in order to advance to level 5 of this research area and claim the federation token there.',
  ],
} as const;

const ResearchAreas = Object.values(ResearchArea);

const props = withDefaults(defineProps<ResearchDialogProps>(), {
  visible: false,
});

const data = reactive<ResearchDialogData>({
  confirmArea: undefined,
  expandedArea: undefined,
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'research', area: ResearchArea): void;
}>();

const knowledge = computed(() => props.player?.resources.knowledge ?? 0);
const hasSufficientKnowledge = computed(() => knowledge.value >= 4);

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

function toggleExpandedInfo(area: ResearchArea): void {
  if (data.expandedArea === area) data.expandedArea = undefined;
  else data.expandedArea = area;
}
</script>
