import {
  applyPatches,
  enablePatches,
  produce,
  type Draft,
  type Patch,
} from "immer";
import { computed, ref, shallowRef, type Ref, type ShallowRef } from "vue";
import { useIDBKeyval } from "@vueuse/integrations/useIDBKeyval";

interface IMemoireHistoire {
  changes: Patch[];
  undoable: Patch[];
  undone: Patch[];
  redoable: Patch[];
}

interface IMemoireOptions {
  persistenceId?: string;
  persistenceMode?: "state-only" | "state+history";
}

interface IMemoireModel<TState extends object> {
  state: ShallowRef<TState>;
  histoire: Ref<IMemoireHistoire>;
}

function getPersistenceKey(
  persistenceId: string | undefined,
  type: "state" | "histoire"
) {
  if (persistenceId) {
    return `mémoire-${type}-${persistenceId}`;
  }

  throw new Error("'persistenceId' must be defined");
}

function getDefaultMemoireOptions(): IMemoireOptions {
  return {
    persistenceMode: "state-only",
  };
}

function getCombinedMemoireOptions(customOptions?: IMemoireOptions) {
  return Object.assign(getDefaultMemoireOptions(), customOptions);
}

function getDefaultHistoireModel(): IMemoireHistoire {
  return {
    changes: [],
    redoable: [],
    undoable: [],
    undone: [],
  };
}

function getInMemoryHistoireRef() {
  return ref<IMemoireHistoire>(getDefaultHistoireModel());
}

function getPersistentStateRef<TState extends object>(
  baseState: TState,
  options: IMemoireOptions
) {
  return useIDBKeyval(
    getPersistenceKey(options.persistenceId, "state"),
    baseState,
    {
      shallow: true,
    }
  ) as Ref;
}

function getInMemoryModel<TState extends object>(
  baseState: TState
): IMemoireModel<TState> {
  return {
    state: shallowRef(baseState),
    histoire: getInMemoryHistoireRef(),
  };
}

function getStateOnlyPersistenceModel<TState extends object>(
  baseState: TState,
  options: IMemoireOptions
): IMemoireModel<TState> {
  return {
    state: getPersistentStateRef(baseState, options),
    histoire: getInMemoryHistoireRef(),
  };
}

function getStateAndHistoirePersistenceModel<TState extends object>(
  baseState: TState,
  options: IMemoireOptions
): IMemoireModel<TState> {
  const key = getPersistenceKey(options.persistenceId, "histoire");
  const val = getDefaultHistoireModel();
  const histoire = useIDBKeyval(key, val);

  return {
    state: getPersistentStateRef(baseState, options),
    histoire,
  };
}

function getModel<TState extends object>(
  baseState: TState,
  options: IMemoireOptions
): IMemoireModel<TState> {
  if (options.persistenceId) {
    switch (options.persistenceMode) {
      case "state+history":
        return getStateAndHistoirePersistenceModel(baseState, options);
      case "state-only":
      default:
        return getStateOnlyPersistenceModel(baseState, options);
    }
  }

  return getInMemoryModel(baseState);
}

export function defineMemoire<TState extends object>(
  baseState: TState,
  options?: IMemoireOptions
) {
  enablePatches();
  const memoireOptions = getCombinedMemoireOptions(options);
  const model = getModel(baseState, memoireOptions);
  const readonlyState = computed(() => Object.freeze(model.state.value));
  const undoStack = computed(() => [...model.histoire.value.undoable]);
  const redoStack = computed(() => [...model.histoire.value.redoable]);
  debugger;
  const $update = (updater: (draft: Draft<TState>) => void) => {
    const nextState = produce(
      model.state.value,
      updater,
      (patches, inversePatches) => {
        model.histoire.value.changes.push(...patches);
        model.histoire.value.undoable.push(...inversePatches);
      }
    );
    // After we add a change, we can't redo something we have undone before.
    // It would make undo and redo unpredictable, because there are new changes.
    model.histoire.value.undone = [];
    model.histoire.value.redoable = [];

    model.state.value = nextState;
  };

  const $undo = () => {
    const undoPatch = model.histoire.value.undoable.pop();
    const redoPatch = model.histoire.value.changes.pop();

    if (undoPatch && redoPatch) {
      model.histoire.value.undone.push(undoPatch);
      model.histoire.value.redoable.push(redoPatch);

      model.state.value = applyPatches(model.state.value, [undoPatch]);
    }
  };

  const $redo = () => {
    const undoPatch = model.histoire.value.undone.pop();
    const redoPatch = model.histoire.value.redoable.pop();

    if (undoPatch && redoPatch) {
      model.histoire.value.changes.push(redoPatch);
      model.histoire.value.undoable.push(undoPatch);

      model.state.value = applyPatches(model.state.value, [redoPatch]);
    }
  };

  return {
    readonlyState,
    $update,
    $undo,
    $redo,
    undoStack,
    redoStack,
  };
}
