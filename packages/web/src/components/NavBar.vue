<template>
  <LoadGameDialog
    :visible="state.showLoadGameDialog"
    @cancel="state.showLoadGameDialog = false"
    @load="onLoad"
  />
  <nav class="navbar is-black" role="navigation">
    <div class="navbar-brand">
      <RouterLink class="navbar-item" to="/">
        <img
          src="https://bulma.io/images/bulma-logo.png"
          width="112"
          height="28"
        />
        Gaia Project
      </RouterLink>

      <!-- <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a> -->
    </div>

    <div v-if="currentUser" class="navbar-end">
      <a click="navbar-item" @click="onRestartGame"> Start New Game </a>
      <a class="navbar-item" @click="state.showLoadGameDialog = true">
        Load Game
      </a>

      <div
        ref="dropdownElement"
        :class="`navbar-item has-dropdown${
          state.dropdownExpanded ? ' is-active' : ''
        }`"
      >
        <a @click="toggleDropdown">
          <div class="navbar-link media">
            <figure class="media-left image is-32x32">
              <img class="is-rounded" :src="avatar" />
            </figure>
            <div class="media-content">
              <p class="content">
                {{ currentUser.displayName ?? currentUser.email }}
              </p>
            </div>
          </div>
        </a>

        <div v-if="state.dropdownExpanded" class="navbar-dropdown">
          <RouterLink to="/profile">
            <div class="navbar-item">Profile</div>
          </RouterLink>

          <hr class="navbar-divider" />
          <a href="/api/auth/logout">
            <div class="navbar-item">Logout</div>
          </a>
        </div>
      </div>
    </div>

    <div v-else class="navbar-end">
      <a class="navbar-item" @click="onRestartGame"> Start New Game </a>
      <a class="navbar-item" @click="state.showLoadGameDialog = true">
        Load Game
      </a>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import LoadGameDialog from '@/components/dialog/LoadGameDialog.vue';
import router from '@/router';
import { Mutation, useStore } from '@/store';
import { useDetectOutsideClick } from '@/utils';
import { SerializedGameContext } from '@gaia-project/engine/src/core/serialization';
import { computed, reactive, ref } from 'vue';

interface NavbarState {
  dropdownExpanded: boolean;
  showLoadGameDialog: boolean;
}

const store = useStore();
const currentUser = computed(() => store.state.currentUser);
const avatar = computed(() => currentUser.value?.avatar ?? '');
const dropdownElement = ref<HTMLDivElement>();

const state = reactive<NavbarState>({
  dropdownExpanded: false,
  showLoadGameDialog: false,
});

function toggleDropdown() {
  state.dropdownExpanded = !state.dropdownExpanded;
}

// Close the dropdown if the user clicks outside of it.
useDetectOutsideClick(dropdownElement, () => {
  state.dropdownExpanded = false;
});

router.beforeEach(() => {
  state.dropdownExpanded = false;
});

function onLoad(context: SerializedGameContext) {
  store.commit(Mutation.LoadGame, context);
  state.showLoadGameDialog = false;
}

function onRestartGame(): void {
  store.commit(Mutation.RestartGame);
}
</script>
