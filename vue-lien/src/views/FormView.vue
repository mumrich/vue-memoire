<script lang="ts" setup>
import { ref } from "vue";
import { useRefHistory } from "@vueuse/core";
import { useIDBKeyval } from "@vueuse/integrations/useIDBKeyval";
import ExampleFormVue from "@/components/ExampleForm.vue";

// const formMemoire = useIDBKeyval("form", {
//   name: "",
//   email: "",
//   select: null,
//   checkbox: false,
// });
const formMemoire = ref({
  name: "",
  email: "",
  select: null,
  checkbox: false,
});
const { history, undo, redo } = useRefHistory(formMemoire, {
  deep: true,
});
</script>

<template>
  <div class="my-3">
    <v-btn @click="undo">
      <v-icon icon="mdi-undo" />
    </v-btn>
    <v-btn @click="redo">
      <v-icon icon="mdi-redo" />
    </v-btn>
  </div>
  <ExampleFormVue v-model:form-model="formMemoire" />
  <h1>State</h1>
  <pre>{{ formMemoire }}</pre>
  <h1>History</h1>
  <pre>{{ history }}</pre>
</template>
