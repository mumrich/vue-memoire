<script lang="ts" setup>
export type PropsType = {
  undo: Function;
  redo: Function;
  undoCount: number;
  redoCount: number;
};

defineProps<PropsType>();
</script>

<template>
  <div class="my-3">
    <v-btn @click="undo"
      ><span><v-icon icon="mdi-undo" /> ({{ undoCount }})</span>
    </v-btn>
    <v-btn @click="redo">
      <span><v-icon icon="mdi-redo" /> ({{ redoCount }})</span>
    </v-btn>
  </div>
</template>
