<template>
  <DetailsViewBase
    :title="player.name"
    :visible="visible"
    @close="$emit('close')"
  >
    <div class="content block">
      <div class="field is-horizontal">
        <div class="field-label">
          <label class="label is-normal">Vicotry Points:</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <span class="is-family-code">{{ player.vp }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="content block box">
      <p class="title is-size-5">Resources</p>
      <div class="level block">
        <StatWithHeading heading="Credits" :stat="player.resources.credits" />
        <StatWithHeading
          heading="Knowledge"
          :stat="player.resources.knowledge"
        />
        <StatWithHeading heading="Ore" :stat="player.resources.ore" />
        <StatWithHeading heading="QIC" :stat="player.resources.qic" />
      </div>
    </div>

    <div class="content block box">
      <p class="title is-size-5">Power Cycle</p>
      <div class="level block">
        <StatWithHeading heading="Level 1" :stat="player.powerCycle.level1" />
        <StatWithHeading heading="Level 2" :stat="player.powerCycle.level2" />
        <StatWithHeading heading="Level 3" :stat="player.powerCycle.level3" />
        <StatWithHeading heading="Gaia" :stat="player.powerCycle.gaia" />
      </div>
    </div>

    <div v-if="player.roundBooster" class="content block box">
      <p class="title is-size-5">Round Booster</p>

      <div class="content block">
        <ul>
          <li>{{ getRoundBoosterText(player.roundBooster!.a) }}</li>
          <li>{{ getRoundBoosterText(player.roundBooster!.b) }}</li>
        </ul>
      </div>
    </div>

    <div class="block box">
      <p class="title is-size-5">Structures</p>

      <table class="table is-bordered is-striped is-fullwidth is-narrow">
        <thead>
          <th>Structure</th>
          <th>Deployed / Available</th>
          <th>Income</th>
        </thead>

        <tbody>
          <tr
            v-for="structureType in Object.values(StructureType)"
            :key="structureType"
          >
            <td>
              <strong>{{ StructureTypeNamesPlural[structureType] }}</strong>
            </td>
            <td>
              {{ player.structures[structureType].active }} /
              {{ player.structures[structureType].available }}
            </td>
            <td>
              {{ getIncomeForStructure(structureType) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </DetailsViewBase>
</template>

<script lang="ts" setup>
import StatWithHeading from '@/components/StatWithHeading.vue';
import DetailsViewBase from '@/components/details/DetailsViewBase.vue';
import { getRoundBoosterText } from '@/utils/round-booster-text';
import {
  Player,
  StructureType,
  StructureTypeNamesPlural,
} from '@gaia-project/engine';

interface PlayerInfoDialogProps {
  player: Player;
  visible: boolean;
}

const props = withDefaults(defineProps<PlayerInfoDialogProps>(), {
  visible: false,
});

defineEmits<{
  (e: 'close'): void;
}>();

function getIncomeForStructure(type: StructureType): string {
  const { player } = props;
  const deployed = player.structures[type].active;

  switch (type) {
    case StructureType.Mine:
      return `${player.faction.income[type][deployed].ore ?? 0} ore`;

    case StructureType.TradingStation:
      return `${player.faction.income[type][deployed].credits ?? 0} credits`;

    case StructureType.ResearchLab:
      return `${
        player.faction.income[type][deployed].knowledge ?? 0
      } knowledge`;

    case StructureType.Academy:
      // TODO: This one is dynamic. Figure it out.
      return '';

    case StructureType.PlanetaryInstitute:
      if (deployed) {
        const { powerNodes, chargePower } =
          player.faction.income[type][deployed];
        return `Gain ${powerNodes} power nodes & charge ${chargePower} power nodes.`;
      }

      return 'none';

    default:
      return 'n/a';
  }
}
</script>
