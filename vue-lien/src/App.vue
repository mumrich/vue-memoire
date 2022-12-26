<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <header>App</header>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>

  <RouterView />
</template>
