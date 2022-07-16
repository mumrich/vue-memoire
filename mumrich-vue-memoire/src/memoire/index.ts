import { enablePatches, produceWithPatches } from "immer";
import { shallowRef } from "vue";

enablePatches();

export function useMemoire<TState>(baseState: TState) {
  const state = shallowRef(baseState);
  const update = (updater: (draftState: TState) => void) => {
    const [nextState, patches, inversePatches] = produceWithPatches(
      state.value,
      updater
    );

    state.value = nextState;
  };

  return [state, update];
}
