<script lang="ts" setup>
import UndoRedoButtonsVue from "@/components/UndoRedoButtons.vue";
import { useImmer } from "@/stores/vue-immer";
import { computed } from "vue";

const immer = useImmer({
  name: "asdf",
  email: "",
  select: null,
  checkbox: false,
  foo: {
    bar: ":-)",
  },
});

const name = computed({
  get: () => immer.state.value.name,
  set: (v) => {
    immer.$update((draftState) => {
      draftState.name = v;
    });
  },
});

const bar = computed({
  get: () => immer.state.value.foo.bar,
  set: (v) => {
    immer.$update((draftState) => {
      draftState.foo.bar = v;
    });
  },
});
</script>

<template>
  <UndoRedoButtonsVue
    :redo-count="immer.redoStack.value.length"
    :redo="immer.$redo"
    :undo-count="immer.undoStack.value.length"
    :undo="immer.$undo"
  />
  <v-text-field v-model="name" />
  <v-text-field v-model="bar" />
  <h1>State</h1>
  <pre>{{ immer.state }}</pre>
</template>
