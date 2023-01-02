import {
  computed,
  triggerRef,
  type WritableComputedRef,
  type ShallowRef,
} from "vue";

export function computedShallowRefProp<T extends object>(
  shallowRef: ShallowRef<T>,
  key: keyof T
) {
  return computed({
    get: () => shallowRef.value[key],
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
