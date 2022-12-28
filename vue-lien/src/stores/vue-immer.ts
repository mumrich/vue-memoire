import produce, { type Draft } from "immer";
import { shallowRef } from "vue";

export function useImmer<TState extends Object>(baseState: TState) {
  const state = shallowRef(Object.freeze(baseState));
  const $update = (updater: (draft: Draft<TState>) => void) => {
    state.value = Object.freeze(produce(state.value, updater));
  };

  return { state, $update };
}
