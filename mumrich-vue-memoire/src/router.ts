import BroadcastTodoVue from "./routes/BroadcastTodo.vue";
import BroadcastTodoReaderVue from "./routes/BroadcastTodoReader.vue";
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

export const routes: RouteRecordRaw[] = [
  { path: "/todo", component: BroadcastTodoVue, alias: "/" },
  { path: "/todo-view", component: BroadcastTodoReaderVue },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
