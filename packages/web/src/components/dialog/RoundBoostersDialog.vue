<template>
  <div v-if="visible" class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Select Round Booster 🔥</p>
        <button
          v-if="showCancel"
          class="delete"
          aria-label="Cancel"
          @click="$emit('cancel')"
        ></button>
      </header>
      <section class="modal-card-body">
        <table class="table is-fullwidth is-hoverable is-striped">
          <thead>
            <tr>
              <th></th>
              <th>Bonus A</th>
              <th>Bonus B</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="booster in boosters" :key="booster.id">
              <td>
                <label class="radio">
                  <input
                    v-model="selectedBoosterId"
                    type="radio"
                    name="booster"
                    :value="booster.id"
                  />
                </label>
              </td>
              <td>{{ getBonusDescription(booster.a) }}</td>
              <td>{{ getBonusDescription(booster.b) }}</td>
            </tr>
          </tbody>
        </table>
      </section>
      <footer class="modal-card-foot">
        <button
          class="button is-primary"
          :disabled="!selectedBoosterId"
          @click="selectBooster"
        >
          Select
        </button>
        <button v-if="showCancel" class="button" @click="$emit('cancel')">
          Cancel
        </button>
      </footer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  FreeAction,
  Income,
  RoundBooster,
  RoundBoosterBonus,
  RoundBoosterBonusType,
  RoundBoosterPassBonusDiscriminator,
} from '@gaia-project/engine';
import { ref } from 'vue';

interface RoundBoostersDialogProps {
  boosters: RoundBooster[];
  showCancel?: boolean;
  visible: boolean;
}

const props = withDefaults(defineProps<RoundBoostersDialogProps>(), {
  showCancel: true,
  visible: false,
});

const selectedBoosterId = ref<number | undefined>();

const DiscriminatorStrings: Record<RoundBoosterPassBonusDiscriminator, string> =
  {
    [RoundBoosterPassBonusDiscriminator.GaiaPlanets]: 'colonized gaia planet',
    [RoundBoosterPassBonusDiscriminator.Mines]: 'mine',
    [RoundBoosterPassBonusDiscriminator.PlanetaryInstitutesAndAcadamies]:
      'academy or planetary institute',
    [RoundBoosterPassBonusDiscriminator.ResearchLabs]: 'research lab',
    [RoundBoosterPassBonusDiscriminator.TradingStations]: 'trading station',
  } as const;

function getActionString(action: FreeAction): string {
  switch (action) {
    case FreeAction.BuildMineOrStartGaiaWithRangeBoost:
      return `As a special
action, you may take a “Build a Mine” action with one
free terraforming step. You can pay ore for additional
terraforming steps, but you cannot combine this action with
another action.`;

    case FreeAction.BuildMineWithTerraforming:
      return `As a special
action, you can take a “Build a Mine” action or “Start a
Gaia Project” with your basic range increased by three. The
normal rules for the actions apply. This action cannot be
combined with another action.`;

    default:
      return '';
  }
}

function getIncomeString(income: Income): string {
  if (income.chargePower) return `charge ${income.chargePower} power tokens`;
  if (income.credits) return `gain ${income.credits} credits`;
  if (income.knowledge) return `gain ${income.knowledge} knowledge`;
  if (income.ore) return `gain ${income.ore} ore`;
  if (income.powerNodes) return `gain ${income.powerNodes} power tokens`;
  if (income.qic) return `gain ${income.qic} QIC`;

  return '';
}

function getBonusDescription(bonus: RoundBoosterBonus): string {
  switch (bonus.type) {
    case RoundBoosterBonusType.Action:
      return getActionString(bonus.action);

    case RoundBoosterBonusType.BonusOnPass:
      return `When you pass this round, gain ${bonus.vp}VP for every ${
        DiscriminatorStrings[bonus.discriminator]
      } you have on the map.`;

    case RoundBoosterBonusType.Income:
      return `As income, ${getIncomeString(bonus.income)} this round.`;

    default:
      return '';
  }
}

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'confirm', booster: RoundBooster): void;
}>();

function selectBooster() {
  const booster = props.boosters.find((b) => b.id === selectedBoosterId.value);
  if (booster) emit('confirm', booster);
}
</script>
