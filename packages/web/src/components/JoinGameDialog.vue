<template>
  <div v-if="visible" class="modal is-active">
    <div class="modal-background" @click="$emit('close')"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Join Game</p>
        <button
          class="delete"
          aria-label="Cancel"
          @click="$emit('close')"
        ></button>
      </header>
      <section class="modal-card-body">
        <fieldset>
          <div class="field">
            <label class="label">Enter Game ID:</label>
            <div class="control">
              <input
                ref="gameIdInput"
                v-model.trim.lazy="state.gameId"
                :class="`input ${v$.gameId.$errors.length ? 'is-danger' : ''}`"
              />
              <span v-if="v$.gameId.$errors.length" class="help is-danger">{{
                v$.gameId.$errors[0]?.$message
              }}</span>
            </div>
          </div>
        </fieldset>
      </section>
      <footer class="modal-card-foot">
        <fieldset>
          <div class="field">
            <div class="control">
              <button class="button is-primary" @click="onJoinClicked">
                Join
              </button>
              <button class="button" @click="$emit('close')">Cancel</button>
            </div>
          </div>
        </fieldset>
      </footer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { reactive, ref, watch } from 'vue';

interface JoinGameDialogProps {
  visible: boolean;
}

interface JoinGameDialogState {
  gameId: string;
}

const props = withDefaults(defineProps<JoinGameDialogProps>(), {
  visible: false,
});

const gameIdInput = ref<HTMLInputElement | null>(null);
const state = reactive<JoinGameDialogState>({
  gameId: '',
});

const rules = {
  gameId: {
    required: helpers.withMessage('Game ID is required', required),
  },
};
const v$ = useVuelidate(rules, state);

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'join', lobbyId: string): void;
}>();

watch(props, (oldValue: JoinGameDialogProps, newValue: JoinGameDialogProps) => {
  if (!oldValue.visible && newValue.visible) {
    state.gameId = '';
    v$.value.gameId.$reset();
    gameIdInput.value?.focus();
  }
});

async function onJoinClicked(): Promise<void> {
  const isValid = await v$.value.$validate();
  if (isValid) {
    emit('join', state.gameId);
  }
}
</script>
