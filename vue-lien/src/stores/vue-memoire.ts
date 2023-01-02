import {
  applyPatches,
  enablePatches,
  produce,
  type Draft,
  type Patch,
} from "immer";
import { computed, shallowRef, type Ref, type ShallowRef } from "vue";
import { useIDBKeyval } from "@vueuse/integrations/useIDBKeyval";
import {
  computedShallowRefProp,
  popOf,
  pushTo,
} from "@/helpers/ShallowRefHelper";

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
  histoire: ShallowRef<IMemoireHistoire>;
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
  return shallowRef<IMemoireHistoire>(getDefaultHistoireModel());
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
  const histoire = useIDBKeyval(key, val, {
    shallow: true,
  });

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

  return {
    readonlyState,
    $update,
    $undo,
    $redo,
    undos,
    redos,
  };
}
