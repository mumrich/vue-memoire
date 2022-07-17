import {
  applyPatches,
  Draft,
  enablePatches,
  Patch,
  produceWithPatches,
} from "immer";
import { ref, shallowRef } from "vue";

export function popN<TArray>(nbrOfPops: number, array: TArray[]): TArray[] {
  const pops: TArray[] = [];

  while (nbrOfPops > 0 && array.length > 0) {
    nbrOfPops--;
    const pop = array.pop();

    if (pop) {
      pops.push(pop);
    }
  }

  return pops;
}

export function useMemoire<TState>(baseState: TState) {
  enablePatches();

  const state = shallowRef(baseState);

  const changes = ref<Patch[]>([]);
  const inverseChanges = ref<Patch[]>([]);

  const undone = ref<Patch[]>([]);
  const redoable = ref<Patch[]>([]);

  const update = (updater: (draftState: Draft<TState>) => void) => {
    const [nextState, patches, inversePatches] = produceWithPatches(
      state.value,
      (draftState) => {
        updater(draftState);
      }
    );

    state.value = nextState;
    changes.value.push(...patches);
    inverseChanges.value.push(...inversePatches);

    // After we add a change, we can't redo something we have undone before.
    // It would make undo and redo unpredictable, because there are new changes.
    undone.value = [];
    redoable.value = [];
  };

  const undo = (maxNbrOfSteps: number = 1) => {
    const inversePatches = popN(maxNbrOfSteps, inverseChanges.value);
    const patches = popN(maxNbrOfSteps, changes.value);

    if (inversePatches.length > 0 && patches.length > 0) {
      undone.value.push(...inversePatches);
      redoable.value.push(...patches);

      state.value = applyPatches(state.value, inversePatches);
    }
  };

  const redo = (maxNbrOfSteps: number = 1) => {
    const inversePatches = popN(maxNbrOfSteps, undone.value);
    const patches = popN(maxNbrOfSteps, redoable.value);

    if (inversePatches.length > 0 && patches.length > 0) {
      changes.value.push(...patches);
      inverseChanges.value.push(...inversePatches);

      state.value = applyPatches(state.value, patches);
    }
  };

  return { state, update, undo, redo };
}
