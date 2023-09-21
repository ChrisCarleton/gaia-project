<template>
  <PageTitle title="Login" />
  <section class="section">
    <div class="container has-text-centered">
      <a href="/api/auth/google">
        <button class="button is-large">
          <span class="icon-text">
            <span class="icon is-large">
              <i class="fab fa-google"></i>
            </span>
            <span>Sign in with Google</span>
          </span>
        </button>
      </a>
    </div>
  </section>
</template>

<script lang="ts" setup>
import PageTitle from '@/components/PageTitle.vue';
</script>
