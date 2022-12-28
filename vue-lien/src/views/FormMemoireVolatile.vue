<script lang="ts" setup>
import ExampleForm from "@/components/ExampleForm.vue";
import { useImmer } from "@/stores/vue-immer";
import { computed, ref, watch, toRaw } from "vue";
import { defineMemoire } from "mumrich-vue-memoire";

const immer = useImmer({
  name: "asdf",
  email: "",
  select: null,
  checkbox: false,
});

const formModel = computed({
  get: () => immer.state.value,
  set: (v) => {
    immer.$update((draftState) => {
      Object.assign(draftState, v);
    });
  },
});
</script>

<template>
  <ExampleForm v-model="formModel" />
  <h1>State</h1>
  <pre>{{ formModel }}</pre>
</template>
