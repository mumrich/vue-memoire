<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { ref } from "vue";
import { useBroadcastTodo } from "../broadcast-todo/Todo";

const memoire = useBroadcastTodo();
const newItemTitle = ref("");
const todos = computed(() => memoire.state.value.todos);

function onKeyupEnter() {
  if (newItemTitle.value != null && newItemTitle.value !== "") {
    memoire.update((s) => {
      s.todos.push({ title: newItemTitle.value, done: false });
    });
    newItemTitle.value = "";
  }
}

function toggleItem(index: number) {
  memoire.update((s) => {
    s.todos[index].done = !s.todos[index].done;
  });
}
</script>

<template>
  <h2>TODO</h2>
  <p>
    <button @click="memoire.undo()">undo</button>
    <button @click="memoire.redo()">redo</button>
  </p>
  <p><input v-model="newItemTitle" @keyup.enter="onKeyupEnter" /></p>
  <ul>
    <li
      v-for="({ title, done }, index) in todos"
      :key="index"
      :class="{ done }"
      @click="toggleItem(index)"
    >
      {{ title }}
    </li>
  </ul>
</template>

<style scoped>
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
