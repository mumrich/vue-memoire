import { ref, shallowRef } from "vue";
import { v4 as uuidv4 } from "uuid";
import {
  applyPatches,
  type Draft,
  enablePatches,
  type Patch,
  produceWithPatches,
} from "immer";
import { popN } from "../helpers/ArrayHelper";

/**
 * The base mémoire implementation providing reacive _state_ and methods for _update_, _undo_ and _redo_.
 * @param baseState
 */
export function defineMemoire<TState extends object>(baseState: TState) {
  enablePatches();

  const uid = uuidv4();
  const state = shallowRef(baseState);
  const changes = ref<Patch[]>([]);
  const inverseChanges = ref<Patch[]>([]);
  const undone = ref<Patch[]>([]);
  const redoable = ref<Patch[]>([]);

  const update = (updater: (draftState: Draft<TState>) => void) => {
    const [nextState, patches, inversePatches] = produceWithPatches(
      state.value,
      updater
    );

    state.value = nextState;
    changes.value.push(...patches);
    inverseChanges.value.push(...inversePatches);
    // After we add a change, we can't redo something we have undone before.
    // It would make undo and redo unpredictable, because there are new changes.
    undone.value = [];
    redoable.value = [];
  };

  const applyChanges = (patches: Patch[]) => {
    state.value = applyPatches(state.value, patches);
  };

  const undo = (maxNbrOfSteps: number = 1) => {
    const inversePatches = popN(maxNbrOfSteps, inverseChanges.value);
    const patches = popN(maxNbrOfSteps, changes.value);

    if (inversePatches.length > 0 && patches.length > 0) {
      undone.value.push(...inversePatches);
      redoable.value.push(...patches);

      applyChanges(inversePatches);
    }
  };

  const redo = (maxNbrOfSteps: number = 1) => {
    const inversePatches = popN(maxNbrOfSteps, undone.value);
    const patches = popN(maxNbrOfSteps, redoable.value);

    if (inversePatches.length > 0 && patches.length > 0) {
      changes.value.push(...patches);
      inverseChanges.value.push(...inversePatches);

      applyChanges(patches);
    }
  };

  return { state, update, undo, redo };
}
