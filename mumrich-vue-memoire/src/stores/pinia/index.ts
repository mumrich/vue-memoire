import { useBroadcastChannel } from "@vueuse/core";
import type { Pinia } from "pinia";
import { toRaw, watch } from "vue";
import { get, set } from "idb-keyval";

export function registerPiniaIDBStore(pinia: Pinia) {
  pinia.use(({ store }) => {
    let skipOneUpdate = false;
    const runGet = () =>
      get(store.$id).then((v) => {
        if (v) {
          skipOneUpdate = true;
          store.$patch(v);
        }
      });

    runGet();

    const { data, post } = useBroadcastChannel<string, string>({
      name: store.$id,
    });

    watch(data, (vNew, vOld) => {
      if (vNew !== vOld) {
        runGet();
      }
    });

    store.$subscribe((mutation, state) => {
      if (skipOneUpdate) {
        skipOneUpdate = false;
        return;
      }

      const rawState = toRaw(state);
      set(mutation.storeId, rawState).then(() =>
        post(Date.now().toLocaleString())
      );
    });
  });
}
