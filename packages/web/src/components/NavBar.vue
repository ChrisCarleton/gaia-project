<template>
  <nav class="navbar is-black" role="navigation">
    <div class="container">
      <div class="navbar-brand">
        <RouterLink class="navbar-item" to="/">
          <img
            src="https://bulma.io/images/bulma-logo.png"
            width="112"
            height="28"
          />
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
        <div
          ref="dropdownElement"
          :class="`navbar-item has-dropdown${
            dropdownExpanded ? ' is-active' : ''
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

          <div v-if="dropdownExpanded" class="navbar-dropdown">
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

      <div v-else class="navbar-end"></div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import router from '@/router';
import { useStore } from '@/store';
import { useDetectOutsideClick } from '@/utils';
import { computed, ref } from 'vue';

const store = useStore();
const currentUser = computed(() => store.state.currentUser);
const avatar = computed(() => currentUser.value?.avatar ?? '');
const dropdownExpanded = ref(false);
const dropdownElement = ref<HTMLDivElement>();

function toggleDropdown() {
  dropdownExpanded.value = !dropdownExpanded.value;
}

// Close the dropdown if the user clicks outside of it.
useDetectOutsideClick(dropdownElement, () => {
  dropdownExpanded.value = false;
});

router.beforeEach(() => {
  dropdownExpanded.value = false;
});
</script>
