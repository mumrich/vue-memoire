import {
  computed,
  type WritableComputedRef,
  type ShallowRef,
  triggerRef,
} from "vue";
import { prop } from "./prop-helper";

export function computedShallowRefProp<T extends object>(
  shallowRef: ShallowRef<T>,
  key: keyof T
) {
  return computed({
    get: () => prop(shallowRef.value, key),
    set: (v) => {
      shallowRef.value[key] = v;
      triggerRef(shallowRef);
    },
  });
}

export function pushTo<T>(target: WritableComputedRef<T[]>, ...items: T[]) {
  target.value = [...target.value, ...items];
}

export function popOf<T>(target: WritableComputedRef<T[]>) {
  const tmp = [...target.value];
  const popedEl = tmp.pop();

  target.value = tmp;

  return popedEl;
}
