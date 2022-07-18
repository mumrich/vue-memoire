import { defineMemoireWithBroadcastChannel } from "../memoire";

type TodoItemType = {
  title: string;
  done: boolean;
};

type BroadcastTodoState = { todos: TodoItemType[] };

export const useBroadcastTodo = () =>
  defineMemoireWithBroadcastChannel<BroadcastTodoState>("todo-memoire", {
    todos: [],
  });
