import type { Patch } from "immer";
import { ref, shallowRef } from "vue";

/**
 * Defines a in-memory store.
 * @param id unique id
 */
export function defineMemoireVolatile<TState extends object>(
  id: string,
  baseState: TState
) {
  const state = shallowRef(Object.freeze(baseState));
  const changes = ref<Patch[]>([]);
}
