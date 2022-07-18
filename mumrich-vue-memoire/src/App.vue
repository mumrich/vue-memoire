<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { useBroadcastChannel } from "@vueuse/core";
import { ref } from "vue";
import { defineMemoire } from "./memoire";

type TodoItemType = {
  title: string;
  done: boolean;
};

type MemoireState = { todos: TodoItemType[] };

const { post, data } = useBroadcastChannel({
  name: "vue-memoire",
});

const memoire = defineMemoire<MemoireState>({ todos: [] }, post, data);
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
