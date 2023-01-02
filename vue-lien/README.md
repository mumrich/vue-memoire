# mumrich-vue-memoire

## Install

```bash
# npm
npm install -S mumrich-vue-memoire

# yarn
yarn add mumrich-vue-memoire
```

## Usage

### In-Memory Store

```ts
import { defineMemoire } from "mumrich-vue-memoire";

const myMemoire = defineMemoire({
  name: "",
  hobbies: [],
});

const hobbies = computed(() => myMemoire.state.value.hobbies);

console.log(hobbies); // []

// update state
myMemoire.update((draftState) => {
  draftState.hobbies = [...draftState.hobbies, "programming 👌"];
});
console.log(hobbies); // ["programming 👌"]

// undo last action
myMemoire.undo();
console.log(hobbies); // []

// trying something dirty...
myMemoire.state.value.hobbies.put("👋"); // Error: Cannot assign to read only property

// redo last action
myMemoire.redo(); // ["programming 👌"]
```

## Worth knowing

- `state` is based on [immerjs](https://immerjs.github.io/immer/) and cannot directly be mutated. Every change must go through `update`:

  ```ts
  // this will throw an error
  myMemoire.state.value.name = "Hannes";
  ```

- `update`-handler **must** be a function within brackets, due to a requirement from **immerjs**:

  ```ts
  // this will throw an error
  myMemoire.update((draftState) => (draftState.name = "Hannes"));

  // this will work
  myMemoire.update((draftState) => {
    draftState.name = "Hannes";
  });
  ```

- `state` is a [shallowRef](https://vuejs.org/api/reactivity-advanced.html#shallowref).
- to maintain reactivity, use spreading or assign on arrays and objects:

  ```ts
  // this update will NOT be detected
  myMemoire.update((draftState) => {
    draftState.hobbies.push("cycling");
  });

  // this update will be detected
  myMemoire.update((draftState) => {
    draftState.hobbies = [...draftState.hobbies, "cycling"];
  });
  ```
