import {
  applyPatches,
  Draft,
  enablePatches,
  Patch,
  produceWithPatches,
} from "immer";
import { Ref, ref, shallowRef, watch, WatchStopHandle } from "vue";
import { v4 as uuidv4 } from "uuid";

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

export enum BroadcastMessageType {
  Update,
}

export interface BroadcastMessage<TPayload> {
  type: BroadcastMessageType;
  sender: string;
  payload: TPayload;
}

export default class Memoire<TState> {
  state = shallowRef<TState>();
  changes = ref<Patch[]>([]);
  inverseChanges = ref<Patch[]>([]);
  undone = ref<Patch[]>([]);
  redoable = ref<Patch[]>([]);
  stopWatchRemoteStateHandle?: WatchStopHandle;
  uid: string;

  constructor(
    baseState: TState,
    private post?: (payload: string) => void,
    private data?: Ref<string>
  ) {
    this.uid = uuidv4();

    enablePatches();

    this.state.value = baseState;

    this.tryWatchRemoteState();
  }

  tryWatchRemoteState() {
    if (this.data && !this.stopWatchRemoteStateHandle) {
      this.stopWatchRemoteStateHandle = watch(this.data, (newData: string) => {
        const data = JSON.parse(newData) as BroadcastMessage<any>;

        if (
          data.sender !== this.uid &&
          data.type === BroadcastMessageType.Update
        ) {
          this.update((draftState) => {
            Object.assign(draftState, data.payload);
          }, false);
        }
      });
    }
  }

  update(updater: (draftState: Draft<TState>) => void, doPost: boolean = true) {
    const [nextState, patches, inversePatches] = produceWithPatches(
      this.state.value,
      (draft) => {
        updater(draft!);
      }
    );

    this.state.value = nextState;
    this.changes.value.push(...patches);
    this.inverseChanges.value.push(...inversePatches);
    // After we add a change, we can't redo something we have undone before.
    // It would make undo and redo unpredictable, because there are new changes.
    this.undone.value = [];
    this.redoable.value = [];

    if (doPost) {
      this.postState();
    }
  }

  postState() {
    if (this.post) {
      this.post(
        JSON.stringify({
          payload: this.state.value,
          sender: this.uid,
          type: BroadcastMessageType.Update,
        } as BroadcastMessage<TState>)
      );
    }
  }

  undo(maxNbrOfSteps: number = 1) {
    const inversePatches = popN(maxNbrOfSteps, this.inverseChanges.value);
    const patches = popN(maxNbrOfSteps, this.changes.value);

    if (inversePatches.length > 0 && patches.length > 0) {
      this.undone.value.push(...inversePatches);
      this.redoable.value.push(...patches);

      this.applyPatches(inversePatches);
    }
  }

  applyPatches(patches: Patch[]) {
    this.state.value = applyPatches(this.state.value!, patches);
    this.postState();
  }

  redo(maxNbrOfSteps: number = 1) {
    const inversePatches = popN(maxNbrOfSteps, this.undone.value);
    const patches = popN(maxNbrOfSteps, this.redoable.value);

    if (inversePatches.length > 0 && patches.length > 0) {
      this.changes.value.push(...patches);
      this.inverseChanges.value.push(...inversePatches);

      this.applyPatches(patches);
    }
  }
}
