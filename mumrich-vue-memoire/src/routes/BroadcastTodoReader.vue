<template>
  <h2>TODO-Reader</h2>
  <ul>
    <li
      v-for="({ title, done }, index) in todos"
      :key="index"
      :class="{ done }"
    >
      {{ title }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useBroadcastTodo } from "../broadcast-todo/Todo";

const memoire = useBroadcastTodo();
const todos = computed(() => memoire.state.value.todos);
</script>

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
