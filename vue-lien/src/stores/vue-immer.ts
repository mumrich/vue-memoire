import {
  applyPatches,
  enablePatches,
  produce,
  type Draft,
  type Patch,
} from "immer";
import { computed, ref, shallowRef } from "vue";

export function useImmer<TState extends Object>(baseState: TState) {
  enablePatches();

  const frozenBaseState = Object.freeze(baseState);
  const state = shallowRef(frozenBaseState);
  const changes = ref<Patch[]>([]);
  const undoable = ref<Patch[]>([]);
  const undone = ref<Patch[]>([]);
  const redoable = ref<Patch[]>([]);

  const undoStack = computed(() => [...undoable.value]);
  const redoStack = computed(() => [...redoable.value]);

  const $update = (updater: (draft: Draft<TState>) => void) => {
    const nextState = produce(
      state.value,
      updater,
      (patches, inversePatches) => {
        changes.value.push(...patches);
        undoable.value.push(...inversePatches);
      }
    );
    // After we add a change, we can't redo something we have undone before.
    // It would make undo and redo unpredictable, because there are new changes.
    undone.value = [];
    redoable.value = [];
    const frozenNewState = Object.freeze<TState>(nextState);

    state.value = frozenNewState;
  };

  const $undo = () => {
    const undoPatch = undoable.value.pop();
    const redoPatch = changes.value.pop();

    if (undoPatch && redoPatch) {
      undone.value.push(undoPatch);
      redoable.value.push(redoPatch);

      state.value = applyPatches(state.value, [undoPatch]);
    }
  };

  const $redo = () => {
    const undoPatch = undone.value.pop();
    const redoPatch = redoable.value.pop();

    if (undoPatch && redoPatch) {
      changes.value.push(redoPatch);
      undoable.value.push(undoPatch);

      state.value = applyPatches(state.value, [redoPatch]);
    }
  };

  return {
    state,
    $update,
    $undo,
    $redo,
    undoStack,
    redoStack,
  };
}
