import { useIDBKeyval } from "@vueuse/integrations/useIDBKeyval";
import { shallowRef, type Ref } from "vue";
import type { IMemoireHistoire, IMemoireOptions } from "../contracts";
import { getPersistenceKey } from "./key-helper";
import { getDefaultHistoireModel } from "./options-helper";

export function getInMemoryHistoireRef() {
  return shallowRef<IMemoireHistoire>(getDefaultHistoireModel());
}

export function getPersistentStateRef<TState extends object>(
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

export function getPersistentHistoireRef(options: IMemoireOptions) {
  const key = getPersistenceKey(options.persistenceId, "histoire");
  const val = getDefaultHistoireModel();

  return useIDBKeyval(key, val, {
    shallow: true,
  });
}
