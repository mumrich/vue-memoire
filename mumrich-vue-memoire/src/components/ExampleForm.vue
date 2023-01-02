<script lang="ts" setup>
import { computed, ref } from "vue";

export type ModelType = {
  name: string;
  email: string;
  select: string | null;
  checkbox: boolean;
};

const props = defineProps<{
  modelValue: ModelType;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", model: ModelType): void;
}>();

function emitterHelper<T>(propName: keyof ModelType, v: T) {
  emits("update:modelValue", { ...props.modelValue, [propName]: v });
}

const name = computed({
  get: () => props.modelValue.name,
  set: (v) => emitterHelper("name", v),
});

const email = computed({
  get: () => props.modelValue.email,
  set: (v) => emitterHelper("email", v),
});

const select = computed({
  get: () => props.modelValue.select,
  set: (v) => emitterHelper("select", v),
});

const checkbox = computed({
  get: () => props.modelValue.checkbox,
  set: (v) => emitterHelper("checkbox", v),
});

const formEl = ref<HTMLFormElement>();
const valid = ref(true);

const items = ref(["Item 1", "Item 2", "Item 3", "Item 4"]);

const nameRules = [
  (v: any) => !!v || "Name is required",
  (v: any) => (v && v.length <= 10) || "Name must be less than 10 characters",
];
const emailRules = [
  (v: any) => !!v || "E-mail is required",
  (v: any) => /.+@.+\..+/.test(v) || "E-mail must be valid",
];

async function validate() {
  const { valid } = await formEl.value!.validate();

  if (valid) {
    alert("Form is valid");
  }
}

function reset() {
  formEl.value!.reset();
}
</script>

<template>
  <v-form ref="formEl" v-model="valid" lazy-validation>
    <v-text-field
      v-model="name"
      :counter="10"
      :rules="nameRules"
      label="Name"
      required
    />
    <v-text-field v-model="email" :rules="emailRules" label="E-mail" required />
    <v-select
      v-model="select"
      :items="items"
      :rules="[(v) => !!v || 'Item is required']"
      label="Item"
      required
    />
    <v-checkbox
      v-model="checkbox"
      :rules="[(v) => !!v || 'You must agree to continue!']"
      label="Do you agree?"
      required
    />
    <v-btn color="success" class="mr-4" @click="validate"> Validate </v-btn>
    <v-btn color="error" class="mr-4" @click="reset"> Reset Form </v-btn>
  </v-form>
</template>
