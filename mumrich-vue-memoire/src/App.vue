<script setup lang="ts">
import { ref, computed } from "vue";
import { useMemoire } from "./memoire";

type TodoItemType = {
  title: string;
  done: boolean;
};

const memoire = useMemoire<{ todos: TodoItemType[] }>({ todos: [] });
const newItemTitle = ref("");
const todos = computed(() => memoire.state.value?.todos);

function onKeyupEnter() {
  if (newItemTitle.value != null && newItemTitle.value !== "") {
    memoire.update((state) =>
      state.todos.push({ title: newItemTitle.value, done: false })
    );
    newItemTitle.value = "";
  }
}

function toggleItem(index: number) {
  memoire.update((state) => {
    state.todos[index].done = !state.todos[index].done;
  });
}
</script>

<template>
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
