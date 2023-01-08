import type { Patch } from "immer";
import type { ShallowRef } from "vue";

export interface IMemoireHistoire {
  changes: Patch[];
  undoable: Patch[];
  undone: Patch[];
  redoable: Patch[];
}

export interface IMemoireOptions {
  persistenceId?: string;
  persistenceMode?: "state-only" | "state+history";
}

export interface IMemoireModel<TState extends object> {
  state: ShallowRef<TState>;
  histoire: ShallowRef<IMemoireHistoire>;
}
