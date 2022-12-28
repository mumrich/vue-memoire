<script lang="ts" setup>
import { ref } from "vue";
import { useRefHistory } from "@vueuse/core";
import ExampleFormVue from "@/components/ExampleForm.vue";
import UndoRedoButtonsVue from "@/components/UndoRedoButtons.vue";

const formMemoire = ref({
  name: "",
  email: "",
  select: null,
  checkbox: false,
});
const { history, undo, redo, redoStack, undoStack } = useRefHistory(
  formMemoire,
  {
    deep: true,
  }
);
</script>

<template>
  <UndoRedoButtonsVue
    :redo-count="redoStack.length"
    :redo="redo"
    :undo-count="undoStack.length"
    :undo="undo"
  />
  <ExampleFormVue v-model:form-model="formMemoire" />
  <h1>State</h1>
  <pre>{{ formMemoire }}</pre>
  <h1>History</h1>
  <pre>{{ history }}</pre>
</template>
