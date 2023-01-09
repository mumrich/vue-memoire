import { computed, type Ref } from "vue";
import { prop } from "./prop-helper";

/**
 * TODO: not working yet...
 * @param parent
 * @param propName
 */
export function writableProp<K extends keyof T, T extends object>(
  parent: Ref<T>,
  propName: K
) {
  return computed({
    get: () => prop(parent.value, propName),
    set: (v) => Object.assign(parent.value, { [propName]: v }),
  });
}
