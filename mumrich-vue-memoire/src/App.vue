<script setup lang="ts">
import { ref } from "vue";
import { useMemoire } from "./memoire";

const { state, update } = useMemoire([
  {
    title: "Learn Vue",
    done: true,
  },
  {
    title: "Use Vue with Immer",
    done: false,
  },
]);
const newItemTitle = ref("");
const undo = ref<Function>();
const redo = ref<Function>();

function onKeyupEnter() {
  const response = update((items) =>
    items.push({ title: newItemTitle.value, done: false })
  );
  undo.value = response.undo;
  redo.value = response.redo;
  newItemTitle.value = "";
}

function toggleItem(index: number) {
  update((items) => {
    items[index].done = !items[index].done;
  });
}
</script>

<template>
  <button @click="undo!()">undo</button>
  <button @click="redo!()">redo</button>
  <input v-model="newItemTitle" @keyup.enter="onKeyupEnter" />
  <ul>
    <li
      v-for="({ title, done }, index) in state"
      :key="index"
      :class="{ done }"
      @click="toggleItem(index)"
    >
      {{ title }}
    </li>
  </ul>
</template>

<style>
li {
  cursor: pointer;
  user-select: none;
}

li:hover {
  color: aqua;
}

.done {
  text-decoration: line-through;
}
</style>
