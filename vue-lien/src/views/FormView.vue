<script lang="ts" setup>
import { formMemoire } from "@/stores/form";
import { ref } from "vue";

const form = ref<HTMLFormElement>();
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
  const { valid } = await form.value!.validate();

  if (valid) {
    alert("Form is valid");
  }
}

function reset() {
  form.value!.reset();
}
</script>

<template>
  <!-- <div class="my-3">
    <v-btn @click="formMemoire.undo()">
      <v-icon icon="mdi-undo" />
    </v-btn>
    <v-btn @click="formMemoire.redo()">
      <v-icon icon="mdi-redo" />
    </v-btn>
  </div> -->
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field
      v-model="formMemoire.name"
      :counter="10"
      :rules="nameRules"
      label="Name"
      required
    />
    <v-text-field
      v-model="formMemoire.email"
      :rules="emailRules"
      label="E-mail"
      required
    />
    <v-select
      v-model="formMemoire.select"
      :items="items"
      :rules="[(v) => !!v || 'Item is required']"
      label="Item"
      required
    />
    <v-checkbox
      v-model="formMemoire.checkbox"
      :rules="[(v) => !!v || 'You must agree to continue!']"
      label="Do you agree?"
      required
    />
    <v-btn color="success" class="mr-4" @click="validate"> Validate </v-btn>
    <v-btn color="error" class="mr-4" @click="reset"> Reset Form </v-btn>
  </v-form>
</template>
