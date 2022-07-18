<template>
  <h1>Vue Memoire App</h1>
  <nav>
    <router-link
      v-for="routeItem in routeItems"
      :key="routeItem.url"
      :to="routeItem.url"
      >{{ routeItem.title }}</router-link
    >
  </nav>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { routes } from "./router";

const routeItems = computed(() =>
  routes.map((rrr) => ({ title: rrr.name ?? rrr.path ?? "??", url: rrr.path }))
);
</script>

<style scoped>
nav {
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-items: center;
  justify-content: space-evenly;
}

a {
  margin: 1rem;
}
</style>
