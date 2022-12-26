import { defineMemoire } from "mumrich-vue-memoire";
import { computed, type Ref, type ShallowRef } from "vue";
import { refDebounced } from "@vueuse/core";
import type { Draft } from "immer";

export const formMemoire = defineMemoire({
  name: "",
  email: "",
  select: null,
  checkbox: false,
});

type MemoireInstance<T extends object> = {
  state: ShallowRef<T>;
  update: (updater: (draftState: Draft<T>) => void, doPost?: boolean) => void;
  undo: (maxNbrOfSteps?: number) => void;
  redo: (maxNbrOfSteps?: number) => void;
};

export function computedMemoire<T extends object>(
  memoire: MemoireInstance<T>,
  keyOfMemoire: keyof MemoireInstance<T>["state"]["value"],
  ms?: number
) {
  const propComputed = computed({
    get: () => memoire.state.value[keyOfMemoire],
    set: (v) => {
      memoire.update((draftState) => {
        (draftState as T)[keyOfMemoire] = v;
      });
    },
  });
  const response = ms ? refDebounced(propComputed, ms) : propComputed;

  return response as Ref<T[keyof T]>;
}
