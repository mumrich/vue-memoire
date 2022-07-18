import { Ref, ref, shallowRef, watch } from "vue";
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
import { computed } from "@vue/reactivity";

export function defineMemoire<TState>(
  baseState: TState,
  post?: (message: BroadcastMessage<TState>) => void,
  data?: Ref<BroadcastMessage<TState>>
) {
  enablePatches();

  const uid = uuidv4();
  const state = shallowRef(baseState);
  const changes = ref<Patch[]>([]);
  const inverseChanges = ref<Patch[]>([]);
  const undone = ref<Patch[]>([]);
  const redoable = ref<Patch[]>([]);

  const postState = () => {
    if (post) {
      post({
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

  if (data) {
    watch(data, (newData) => {
      if (
        newData.sender !== uid &&
        newData.type === BroadcastMessageType.Update
      ) {
        update((draftState) => {
          Object.assign(draftState, newData.payload);
        }, false);
      }
    });
  }

  return { state, update, undo, redo };
}

export function defineMemoireWithBroadcastChannel<TState>(
  channelName: string,
  baseState: TState
) {
  const { post, data } = useBroadcastChannel({
    name: channelName,
  });

  const postBroadcastMessage = (message: BroadcastMessage<TState>) => {
    if (message) {
      const serializedMessage = JSON.stringify(message);
      post(serializedMessage);
    }
  };

  const remoteData = computed(() => {
    if (data.value) {
      return JSON.parse(data.value);
    }
  });

  return defineMemoire(baseState, postBroadcastMessage, remoteData);
}
