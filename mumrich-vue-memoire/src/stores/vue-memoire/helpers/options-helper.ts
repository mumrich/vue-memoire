import type { IMemoireHistoire, IMemoireOptions } from "../contracts";

export function getCombinedMemoireOptions(customOptions?: IMemoireOptions) {
  return Object.assign(getDefaultMemoireOptions(), customOptions);
}

export function getDefaultMemoireOptions(): IMemoireOptions {
  return {
    persistenceMode: "state-only",
  };
}

export function getDefaultHistoireModel(): IMemoireHistoire {
  return {
    changes: [],
    redoable: [],
    undoable: [],
    undone: [],
  };
}
