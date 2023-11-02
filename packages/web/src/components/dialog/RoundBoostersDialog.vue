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
              <td>{{ getRoundBoosterText(booster.a) }}</td>
              <td>{{ getRoundBoosterText(booster.b) }}</td>
            </tr>
          </tbody>
        </table>
      </section>
      <footer class="modal-card-foot">
        <button
          class="button is-primary"
          :disabled="typeof selectedBoosterId !== 'number'"
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
import { getRoundBoosterText } from '@/utils/round-booster-text';
import { RoundBooster } from '@gaia-project/engine';
import { ref } from 'vue';

interface RoundBoostersDialogProps {
  boosters: Readonly<RoundBooster[]>;
  showCancel?: boolean;
  visible: boolean;
}

const props = withDefaults(defineProps<RoundBoostersDialogProps>(), {
  showCancel: true,
  visible: false,
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
