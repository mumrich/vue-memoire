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
    names: [] as string[],
  },
  {
    persistenceId: "TEST-PERSIST-STATE+HISTOIRE",
    persistenceMode: "state+history",
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

function addName() {
  memoire.$update((draftState) => {
    draftState.names.push(draftState.name);
    draftState.name = "";
  });
}

function tryIllegalAction() {
  try {
    (memoire.readonlyState.value.name as any) = "Test";
  } catch (e) {
    alert(e);
  }
}
</script>

<template>
  <UndoRedoButtonsVue
    :redo-count="memoire.redos.value"
    :redo="memoire.$redo"
    :undo-count="memoire.undos.value"
    :undo="memoire.$undo"
  />
  <v-text-field v-model="name" />
  <v-text-field v-model="bar" />
  <p>
    <v-btn @click="addName">Add</v-btn>
  </p>
  <p>
    <v-btn @click="tryIllegalAction">try illegal action</v-btn>
  </p>
  <h1>State</h1>
  <pre>{{ memoire.readonlyState }}</pre>
</template>
