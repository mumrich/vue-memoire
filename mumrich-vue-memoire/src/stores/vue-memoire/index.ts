import {
  computedShallowRefProp,
  pushTo,
  popOf,
} from "../../helpers/shallowref-helper";
import produce, { enablePatches, type Draft, applyPatches } from "immer";
import { computed } from "vue";
import type { IMemoireOptions } from "./contracts";
import { getModel } from "./helpers/model-helper";
import { getCombinedMemoireOptions } from "./helpers/options-helper";
import { prop } from "@/helpers/prop-helper";

/**
 * The base mémoire implementation providing a reactive readonly _state_ and methods for _update_, _undo_ and _redo_.
 * @param baseState a object representing the initial/base state.
 * @param options (optional) a object containing custom options.
 */
export function defineMemoire<TState extends object>(
  baseState: TState,
  options?: IMemoireOptions
) {
  enablePatches();
  const memoireOptions = getCombinedMemoireOptions(options);

  const { histoire, state } = getModel(baseState, memoireOptions);

  const changes = computedShallowRefProp(histoire, "changes");
  const redoable = computedShallowRefProp(histoire, "redoable");
  const undoable = computedShallowRefProp(histoire, "undoable");
  const undone = computedShallowRefProp(histoire, "undone");

  const readonlyState = computed(() => Object.freeze(state.value));
  const undos = computed(() => undoable.value.length);
  const redos = computed(() => redoable.value.length);

  const $update = (updater: (draft: Draft<TState>) => void) => {
    const nextState = produce(
      state.value,
      updater,
      (patches, inversePatches) => {
        pushTo(changes, ...patches);
        pushTo(undoable, ...inversePatches);
      }
    );
    // After we add a change, we can't redo something we have undone before.
    // It would make undo and redo unpredictable, because there are new changes.
    undone.value = [];
    redoable.value = [];

    state.value = nextState;
  };

  const $undo = () => {
    const undoPatch = popOf(undoable);
    const redoPatch = popOf(changes);

    if (undoPatch && redoPatch) {
      pushTo(undone, undoPatch);
      pushTo(redoable, redoPatch);

      state.value = applyPatches(state.value, [undoPatch]);
    }
  };

  const $redo = () => {
    const undoPatch = popOf(undone);
    const redoPatch = popOf(redoable);

    if (undoPatch && redoPatch) {
      pushTo(changes, redoPatch);
      pushTo(undoable, undoPatch);

      state.value = applyPatches(state.value, [redoPatch]);
    }
  };

  function $writableProp<K extends keyof TState>(propName: K) {
    return computed({
      get: () => prop(readonlyState.value, propName),
      set: (v) =>
        $update((draftState) => {
          Object.assign(draftState, { [propName]: v });
        }),
    });
  }

  return {
    $redo,
    $undo,
    $update,
    $writableProp,
    readonlyState,
    redos,
    undos,
  };
}
