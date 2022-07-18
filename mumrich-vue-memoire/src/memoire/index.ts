import { Patch } from "immer";
import { useBroadcastChannel } from "@vueuse/core";
import Memoire from "./Memoire";

export interface UseMemoireOptions {
  namespace?: string;
}

export interface BroadcastMessagePayloadChanges {
  changes: Patch[];
  inverseChanges: Patch[];
}

export function useMemoire<TState>(
  baseState: TState,
  options: UseMemoireOptions = {}
) {
  const { post, data } = useBroadcastChannel({
    name: `vue-memoire${options.namespace ? "-" + options.namespace : ""}`,
  });

  return new Memoire(baseState, post, data);
}
