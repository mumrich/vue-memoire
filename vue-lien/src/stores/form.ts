import { defineMemoire } from "mumrich-vue-memoire";
import { computed, type ComputedGetter, type ComputedSetter } from "vue";
import { refDebounced } from "@vueuse/core";
import { useIDBKeyval } from "@vueuse/integrations/useIDBKeyval";

let formMemoire: any = null;
export const formMemoireStoredObject = useIDBKeyval("form", {
  name: "",
  email: "",
  select: null,
  checkbox: false,
});

export const useFormMemoire = () => {
  if (formMemoire == null) {
    formMemoire = defineMemoire(formMemoireStoredObject.value);
  }

  return formMemoire;
};

export function debouncedComputed<T>(
  getter: ComputedGetter<T>,
  setter?: ComputedSetter<T>,
  debounceTimeoutInMs: number = 500
) {
  const innerComputed = setter
    ? computed({
        get: getter,
        set: setter,
      })
    : computed(getter);
  return refDebounced(innerComputed, debounceTimeoutInMs);
}
