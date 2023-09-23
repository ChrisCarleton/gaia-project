<template>
  <PageTitle title="Page Not Found"></PageTitle>
  <section class="section">
    <div class="container">
      <p class="content">
        The page you are looking for could not be found. Click
        <RouterLink to="/">here</RouterLink> to return to the home page.
      </p>
    </div>
  </section>
</template>

<script lang="ts" setup>
import PageTitle from '@/components/PageTitle.vue';
</script>
