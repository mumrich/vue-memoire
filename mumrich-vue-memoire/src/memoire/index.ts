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

export function defineMemoire<TState>(
  baseState: TState,
  post?: (message: string) => void,
  data?: Ref<string>
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
      post(
        JSON.stringify({
          payload: state.value,
          sender: uid,
          type: BroadcastMessageType.Update,
        } as BroadcastMessage<TState>)
      );
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
    watch(data, (newData: string) => {
      const broadcasMessage = JSON.parse(newData) as BroadcastMessage<any>;

      if (
        broadcasMessage.sender !== uid &&
        broadcasMessage.type === BroadcastMessageType.Update
      ) {
        update((draftState) => {
          Object.assign(draftState, broadcasMessage.payload);
        }, false);
      }
    });
  }

  return { state, update, undo, redo };
}
