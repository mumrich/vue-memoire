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
    <v-btn @click="undo" :disabled="undoCount <= 0"
      ><span><v-icon icon="mdi-undo" /> ({{ undoCount }})</span>
    </v-btn>
    <v-btn @click="redo" :disabled="redoCount <= 0" class="ml-3">
      <span><v-icon icon="mdi-redo" /> ({{ redoCount }})</span>
    </v-btn>
  </div>
</template>
