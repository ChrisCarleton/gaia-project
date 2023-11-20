<template>
  <DialogBase title="Load Game" rows="12" @close="$emit('cancel')">
    <template #default>
      <div class="field">
        <label class="label">Paste context JSON:</label>
        <div class="control is-small">
          <textarea
            v-model.trim="data.contextText"
            class="textarea"
            autofocus
          ></textarea>
          <div v-if="v$.contextText.$error" class="help is-danger">
            <p>Please correct the following errors before proceeding:</p>
            <ul>
              <li v-for="error in v$.contextText.$errors" :key="error.$uid">
                <span class="icon-text">
                  <span class="icon"> ❌ </span>
                  <span>{{ error.$message }}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>
    <template #buttons>
      <button
        class="button is-primary"
        :disabled="data.contextText.length === 0"
        @click="onLoad"
      >
        Load
      </button>
      <button class="button" @click="$emit('cancel')">Cancel</button>
    </template>
  </DialogBase>
</template>

<script lang="ts" setup>
import DialogBase from '@/components/dialog/DialogBase.vue';
import {
  GameContextSchema,
  SerializedGameContext,
} from '@gaia-project/engine/src/core/serialization';
import { ValidatorResponse, useVuelidate } from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { reactive } from 'vue';

interface LoadGameDialogState {
  contextText: string;
  parsedContext?: SerializedGameContext;
}

const data = reactive<LoadGameDialogState>({
  contextText: '',
});

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'load', context: SerializedGameContext): void;
}>();

function isValidGameContext(value: string): ValidatorResponse {
  let parsedJSON: unknown;
  try {
    parsedJSON = JSON.parse(value);
  } catch {
    return {
      $valid: false,
    };
  }

  const result = GameContextSchema.safeParse(parsedJSON);
  if (result.success) {
    data.parsedContext = result.data;
    return {
      $valid: true,
    };
  }

  return {
    $valid: false,
    issues: result.error.issues,
  };
}

const validation = {
  contextText: {
    required: helpers.withMessage('Context JSON is required.', required),
    isValidJSON: helpers.withMessage(
      'Context JSON was invalid',
      isValidGameContext,
    ),
  },
};
const v$ = useVuelidate(validation, data);

async function onLoad(): Promise<void> {
  const isValid = await v$.value.$validate();
  if (isValid) {
    emit('load', data.parsedContext!);
  }
}
</script>
