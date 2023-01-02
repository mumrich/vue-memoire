<script lang="ts" setup>
import { useIDBKeyval } from "@vueuse/integrations/useIDBKeyval";
import { triggerRef } from "vue";

const foo = useIDBKeyval<{
  test: number[];
}>(
  "test",
  {
    test: [],
  },
  {
    shallow: true,
  }
);
function bar() {
  foo.value.test.push(foo.value.test.length);
  triggerRef(foo);
}
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
    <v-btn @click="bar">BAR</v-btn>
    <pre>{{ foo }}</pre>
  </div>
</template>
