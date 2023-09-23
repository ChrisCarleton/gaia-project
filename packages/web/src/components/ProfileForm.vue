<template>
  <nav class="breadcrumb block" aria-role="breadcrumbs">
    <ul>
      <li><RouterLink to="/">Home</RouterLink></li>
      <li class="is-active"><a href="#">Profile</a></li>
    </ul>
  </nav>

  <div class="tile is-ancestor">
    <div class="tile is-parent is-4">
      <div class="tile is-child box">
        <p class="block content has-text-centered">
          <PlayerAvatar :player="user"></PlayerAvatar>
        </p>
        <p class="block content">
          <span class="heading">Email</span>
          <span>{{ user.email }}</span>
        </p>
        <p class="block content">
          <span class="heading">Joined</span>
          <span>{{ memberSince }}</span>
        </p>
      </div>
    </div>

    <div class="tile is-parent is-8">
      <div class="tile is-child">
        <form @submit.prevent="onSave">
          <fieldset :disabled="isSaving">
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label for="displayName" class="label">Display name:</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input
                      id="displayName"
                      v-model="data.displayName"
                      :class="`input${
                        v$.displayName.$error ? ' is-danger' : ''
                      }`"
                      :maxlength="100"
                      autofocus
                    />
                    <span v-if="v$.displayName.$error" class="help is-danger">
                      {{ v$.displayName.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="field">
              <div class="buttons is-right">
                <button
                  type="submit"
                  :class="`button is-primary${isSaving ? ' is-loading' : ''}`"
                >
                  Save
                </button>
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { User } from '@/apiClient';
import PlayerAvatar from '@/components/PlayerAvatar.vue';
import { Action, useStore } from '@/store';
import { useErrorHandling } from '@/utils/use-error-handling';
import { useVuelidate } from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import dayjs from 'dayjs';
import { computed, reactive, ref } from 'vue';

interface ProfileFormProps {
  user: User;
}

interface ProfileFormData {
  displayName: string;
}

const handleError = useErrorHandling();
const store = useStore();

const props = defineProps<ProfileFormProps>();
const data = reactive<ProfileFormData>({
  displayName: props.user.displayName ?? '',
});
const isSaving = ref(false);
const memberSince = computed(() => dayjs(props.user.memberSince).fromNow());

const validation = {
  displayName: {
    required: helpers.withMessage('Display name is required', required),
  },
};
const v$ = useVuelidate(validation, data);

async function onSave(): Promise<void> {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  isSaving.value = true;
  try {
    /* eslint-disable vue/no-mutating-props */
    props.user.displayName = data.displayName;
    await props.user.save();
    await store.dispatch(
      Action.ToastSuccess,
      'Profile has been successfully saved.',
    );
  } catch (error) {
    await handleError(error);
  } finally {
    isSaving.value = false;
  }
}
</script>
