<template>
  <PageTitle title="Profile"></PageTitle>
  <section class="section">
    <div class="container">
      <RequireAuth>
        <ProfileForm :user="currentUser!"></ProfileForm>
      </RequireAuth>
    </div>
  </section>
</template>

<script lang="ts" setup>
import PageTitle from '@/components/PageTitle.vue';
import ProfileForm from '@/components/ProfileForm.vue';
import RequireAuth from '@/components/RequireAuth.vue';
import { useStore } from '@/store';
import { computed } from 'vue';

const store = useStore();
const currentUser = computed(() => store.state.currentUser);
</script>
