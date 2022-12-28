<script lang="ts" setup>
import { ref } from "vue";
import { useRefHistory } from "@vueuse/core";
import ExampleFormVue from "@/components/ExampleForm.vue";
import UndoRedoButtonsVue from "@/components/UndoRedoButtons.vue";

const formModel = ref({
  name: "",
  email: "",
  select: null,
  checkbox: false,
});

const { history, undo, redo, redoStack, undoStack } = useRefHistory(formModel, {
  deep: true,
});
</script>

<template>
  <UndoRedoButtonsVue
    :redo-count="redoStack.length"
    :redo="redo"
    :undo-count="undoStack.length"
    :undo="undo"
  />
  <ExampleFormVue v-model="formModel" />
  <h1>History</h1>
  <pre>{{ history }}</pre>
</template>
