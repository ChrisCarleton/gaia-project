<template>
  <DetailsViewBase
    title="🔥 Select Round Booster"
    :visible="visible"
    @close="$emit('cancel')"
  >
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
          <td>{{ getRoundBoosterText(booster.a) }}</td>
          <td>{{ getRoundBoosterText(booster.b) }}</td>
        </tr>
      </tbody>
    </table>
    <div class="field is-grouped is-grouped-right">
      <div class="control">
        <button
          class="button is-primary"
          :disabled="typeof selectedBoosterId !== 'number'"
          @click="selectBooster"
        >
          Select
        </button>
      </div>
      <div class="control">
        <button class="button" @click="$emit('cancel')">Cancel</button>
      </div>
    </div>
  </DetailsViewBase>
</template>

<script lang="ts" setup>
import { getRoundBoosterText } from '@/utils/round-booster-text';
import { RoundBooster } from '@gaia-project/engine';
import { ref } from 'vue';

import DetailsViewBase from './DetailsViewBase.vue';

interface RoundBoosterDetailsProps {
  boosters: Readonly<RoundBooster[]>;
  visible?: boolean;
}

const props = withDefaults(defineProps<RoundBoosterDetailsProps>(), {
  visible: true,
});

const selectedBoosterId = ref<number | undefined>();

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'confirm', booster: RoundBooster): void;
}>();

function selectBooster() {
  const booster = props.boosters.find((b) => b.id === selectedBoosterId.value);
  if (booster) emit('confirm', booster);
}
</script>
