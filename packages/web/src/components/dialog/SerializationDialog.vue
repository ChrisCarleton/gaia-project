<template>
  <DialogBase
    :visible="visible"
    title="Serialized Game Data"
    @close="$emit('close')"
  >
    <template #default>
      <p class="is-size-7 is-family-code">
        {{ data }}
      </p>
    </template>
    <template #buttons>
      <button class="button is-primary" @click="copyJSON">Copy</button>
      <button class="button" @click="$emit('close')">Close</button>
      <span v-if="showCopied" class="tag is-success"> ✔️ Copied! </span>
    </template>
  </DialogBase>
</template>

<script lang="ts" setup>
import DialogBase from '@/components/dialog/DialogBase.vue';
import { computed, ref } from 'vue';

interface SerializationDialogProps {
  game: unknown;
  visible: boolean;
}

const props = withDefaults(defineProps<SerializationDialogProps>(), {
  visible: false,
});

const data = computed(() => JSON.stringify(props.game));
const showCopied = ref(false);

defineEmits<{
  (e: 'close'): void;
}>();

function copyJSON() {
  navigator.clipboard.writeText(data.value);
  showCopied.value = true;
  setTimeout(() => (showCopied.value = false), 2500);
}
</script>
