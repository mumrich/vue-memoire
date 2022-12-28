<script lang="ts" setup>
import { computed, ref } from "vue";

export type ModelType = {
  name: string;
  email: string;
  select: string | null;
  checkbox: boolean;
};

const props = defineProps<{
  formModel: ModelType;
}>();
const emits = defineEmits<{
  (e: "update:model", model: ModelType): void;
}>();

const formEl = ref<HTMLFormElement>();
const formModel = computed({
  get: () => props.formModel,
  set: (v) => emits("update:model", v),
});
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
      v-model="formModel.name"
      :counter="10"
      :rules="nameRules"
      label="Name"
      required
    />
    <v-text-field
      v-model="formModel.email"
      :rules="emailRules"
      label="E-mail"
      required
    />
    <v-select
      v-model="formModel.select"
      :items="items"
      :rules="[(v) => !!v || 'Item is required']"
      label="Item"
      required
    />
    <v-checkbox
      v-model="formModel.checkbox"
      :rules="[(v) => !!v || 'You must agree to continue!']"
      label="Do you agree?"
      required
    />
    <v-btn color="success" class="mr-4" @click="validate"> Validate </v-btn>
    <v-btn color="error" class="mr-4" @click="reset"> Reset Form </v-btn>
  </v-form>
</template>
