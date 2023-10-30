<template>
  <DialogBase
    :visible="visible"
    :title="player.name"
    show-close
    @close="$emit('close')"
  >
    <template #default>
      <div class="content block">
        <p class="heading">Resources</p>

        <div class="level">
          <div class="level-item">
            <div>
              <p class="heading">Credits</p>
              <p class="is-family-code">{{ player.resources.credits }}</p>
            </div>
          </div>

          <div class="level-item">
            <div>
              <p class="heading">Knowledge</p>
              <p class="is-family-code">{{ player.resources.knowledge }}</p>
            </div>
          </div>

          <div class="level-item">
            <div>
              <p class="heading">Ore</p>
              <p class="is-family-code">{{ player.resources.ore }}</p>
            </div>
          </div>

          <div class="level-item">
            <div>
              <p class="heading">QIC</p>
              <p class="is-family-code">{{ player.resources.qic }}</p>
            </div>
          </div>

          <div class="level-item">
            <div>
              <p class="heading">VP</p>
              <p class="is-family-code">{{ player.vp }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="player.roundBooster" class="block">
        <p class="heading">Round Booster</p>

        <div class="level">
          <div class="level-left">
            <div class="level-item">
              {{ getRoundBoosterText(player.roundBooster!.a) }}
            </div>
          </div>

          <div class="level-right">
            <div class="level-item">
              {{ getRoundBoosterText(player.roundBooster!.b) }}
            </div>
          </div>
        </div>
      </div>

      <div class="block">
        <p class="heading">Structures</p>

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
    </template>
    <template #buttons>
      <button class="button is-primary" @click="$emit('close')">Close</button>
    </template>
  </DialogBase>
</template>

<script lang="ts" setup>
import DialogBase from '@/components/dialog/DialogBase.vue';
import { StructureTypeNamesPlural } from '@/constants';
import { getRoundBoosterText } from '@/utils/round-booster-text';
import { Player, StructureType } from '@gaia-project/engine';

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
        const income = player.faction.income[StructureType.PlanetaryInstitute];
        return `Gain ${income.powerNodes ?? 0} power nodes; charge ${
          income.chargePower ?? 0
        } power nodes.`;
      }

      return 'none';

    default:
      return 'n/a';
  }
}
</script>
