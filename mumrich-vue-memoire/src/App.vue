<script setup lang="ts">
import { ref } from "vue";
import { useMemoire } from "./memoire";

type TodoItemType = {
  title: string;
  done: boolean;
};

const { state, update, undo, redo } = useMemoire<TodoItemType[]>([]);
const newItemTitle = ref("");

function onKeyupEnter() {
  if (newItemTitle.value != null && newItemTitle.value !== "") {
    update((items) => items.push({ title: newItemTitle.value, done: false }));
    newItemTitle.value = "";
  }
}

function toggleItem(index: number) {
  update((items) => {
    items[index].done = !items[index].done;
  });
}
</script>

<template>
  <p>
    <button @click="undo()">undo</button>
    <button @click="redo()">redo</button>
  </p>
  <p><input v-model="newItemTitle" @keyup.enter="onKeyupEnter" /></p>
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
