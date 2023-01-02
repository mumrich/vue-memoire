<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterView, useRouter, type RouteRecordNormalized } from "vue-router";

const router = useRouter();
const routes = computed(() => router.getRoutes());
const drawer = ref<boolean | null>(null);

function getRouteName(route: RouteRecordNormalized) {
  return route.name?.toString() ?? route.path;
}
</script>

<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer">
      <v-list>
        <v-list-item
          v-for="route in routes"
          :key="route.path"
          :to="route.path"
          :title="getRouteName(route)"
        />
      </v-list>
    </v-navigation-drawer>
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>My Awesome Application</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>
