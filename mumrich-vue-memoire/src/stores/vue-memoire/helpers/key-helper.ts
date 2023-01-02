export function getPersistenceKey(
  persistenceId: string | undefined,
  type: "state" | "histoire"
) {
  if (persistenceId) {
    return `mémoire-${type}-${persistenceId}`;
  }

  throw new Error("'persistenceId' must be defined");
}
