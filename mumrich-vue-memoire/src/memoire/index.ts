import { Ref, ref, shallowRef, watch, computed } from "vue";
import { v4 as uuidv4 } from "uuid";
import {
  applyPatches,
  Draft,
  enablePatches,
  Patch,
  produceWithPatches,
} from "immer";
import { popN } from "../helpers/ArrayHelper";
import { BroadcastMessage } from "./BroadcastMessage";
import { BroadcastMessageType } from "./BroadcastMessageType";
import { useBroadcastChannel } from "@vueuse/core";

/**
 * The base mémoire implementation providing reacive _state_ and methods for _update_, _undo_ and _redo_.
 * @param baseState
 * @param postBroadcastMessage (optional) method that receives a BroadcastMessage on state change.
 * @param remoteState (optional) reactive (remote) state that will be observed and replaces the current state when changed.
 */
export function defineMemoire<TState>(
  baseState: TState,
  postBroadcastMessage?: (message: BroadcastMessage<TState>) => void,
  remoteState?: Ref<BroadcastMessage<TState> | null>
) {
  enablePatches();

  const uid = uuidv4();
  const state = shallowRef(baseState);
  const changes = ref<Patch[]>([]);
  const inverseChanges = ref<Patch[]>([]);
  const undone = ref<Patch[]>([]);
  const redoable = ref<Patch[]>([]);

  const postState = () => {
    if (postBroadcastMessage) {
      postBroadcastMessage({
        payload: state.value,
        sender: uid,
        type: BroadcastMessageType.Update,
      });
    }
  };

  const update = (
    updater: (draftState: Draft<TState>) => void,
    doPost: boolean = true
  ) => {
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

    if (doPost) {
      postState();
    }
  };

  const applyChanges = (patches: Patch[]) => {
    state.value = applyPatches(state.value, patches);
    postState();
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

  if (remoteState) {
    watch(remoteState, (newState) => {
      if (
        newState &&
        newState.sender !== uid &&
        newState.type === BroadcastMessageType.Update
      ) {
        update((draftState) => {
          Object.assign(draftState, newState.payload);
        }, false);
      }
    });
  }

  return { state, update, undo, redo };
}

/**
 * A distributed mémoire that uses the [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel). This is usefull if the state should be shared between _windows_, _tabs_ and _iframes_ with the same [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin).
 * @param channelName
 * @param baseState
 */
export function defineMemoireWithBroadcastChannel<TState>(
  channelName: string,
  baseState: TState
) {
  const { post, data } = useBroadcastChannel<string, string>({
    name: channelName,
  });

  const postBroadcastMessage = (message: BroadcastMessage<TState>) => {
    if (message) {
      const serializedMessage = JSON.stringify(message);
      post(serializedMessage);
    }
  };

  const remoteState = computed<BroadcastMessage<TState> | null>(() => {
    return data.value
      ? (JSON.parse(data.value) as BroadcastMessage<TState>)
      : null;
  });

  const { redo, state, undo, update } = defineMemoire(
    baseState,
    postBroadcastMessage,
    remoteState
  );

  return {
    redo,
    state,
    undo,
    update,
    data,
    remoteState,
  };
}
