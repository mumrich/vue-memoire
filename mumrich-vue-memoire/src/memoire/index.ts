import { applyPatches, Draft, enablePatches, produceWithPatches } from "immer";
import { shallowRef } from "vue";

enablePatches();

export function useMemoire<TState>(baseState: TState) {
  const state = shallowRef(baseState);
  const update = (updater: (draftState: Draft<TState>) => void) => {
    const [nextState, patches, inversePatches] = produceWithPatches(
      state.value,
      (draftState) => {
        updater(draftState);
      }
    );

    const undo = () =>
      (state.value = applyPatches(state.value, inversePatches));
    const redo = () => (state.value = applyPatches(state.value, patches));
    state.value = nextState;

    return { undo, redo };
  };

  return { state, update };
}
