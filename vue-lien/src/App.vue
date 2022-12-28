<script setup lang="ts">
import { ref } from "vue";
import { RouterView } from "vue-router";

const drawer = ref<boolean | null>(null);
</script>

<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer">
      <v-list>
        <v-list-item
          v-for="route in $router.getRoutes()"
          :key="route.path"
          :to="route.path"
          :title="route.name?.toString() ?? route.path"
        />
      </v-list>
    </v-navigation-drawer>
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>
