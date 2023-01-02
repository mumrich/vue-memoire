import { shallowRef } from "vue";
import type { IMemoireOptions, IMemoireModel } from "../contracts";
import {
  getPersistentStateRef,
  getInMemoryHistoireRef,
  getPersistentHistoireRef,
} from "./persistence-helper";

export function getStateOnlyPersistenceModel<TState extends object>(
  baseState: TState,
  options: IMemoireOptions
): IMemoireModel<TState> {
  return {
    state: getPersistentStateRef(baseState, options),
    histoire: getInMemoryHistoireRef(),
  };
}

export function getInMemoryModel<TState extends object>(
  baseState: TState
): IMemoireModel<TState> {
  return {
    state: shallowRef(baseState),
    histoire: getInMemoryHistoireRef(),
  };
}

export function getStateAndHistoirePersistenceModel<TState extends object>(
  baseState: TState,
  options: IMemoireOptions
): IMemoireModel<TState> {
  const state = getPersistentStateRef(baseState, options);
  const histoire = getPersistentHistoireRef(options);

  return {
    state,
    histoire,
  };
}

export function getModel<TState extends object>(
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
