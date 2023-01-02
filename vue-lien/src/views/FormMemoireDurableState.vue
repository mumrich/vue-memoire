<script lang="ts" setup>
import UndoRedoButtonsVue from "@/components/UndoRedoButtons.vue";
import { defineMemoire } from "@/stores/vue-memoire";
import { computed } from "vue";

const memoire = defineMemoire(
  {
    name: "asdf",
    email: "",
    select: null,
    checkbox: false,
    foo: {
      bar: ":-)",
    },
  },
  {
    persistenceId: "TEST-PERSIST-STATE-ONLY",
  }
);

const name = computed({
  get: () => memoire.readonlyState.value.name,
  set: (v) => {
    memoire.$update((draftState) => {
      draftState.name = v;
    });
  },
});

const bar = computed({
  get: () => memoire.readonlyState.value.foo.bar,
  set: (v) => {
    memoire.$update((draftState) => {
      draftState.foo.bar = v;
    });
  },
});
</script>

<template>
  <UndoRedoButtonsVue
    :redo-count="memoire.redoStack.value.length"
    :redo="memoire.$redo"
    :undo-count="memoire.undoStack.value.length"
    :undo="memoire.$undo"
  />
  <v-text-field v-model="name" />
  <v-text-field v-model="bar" />
  <h1>State</h1>
  <pre>{{ memoire.readonlyState }}</pre>
</template>
