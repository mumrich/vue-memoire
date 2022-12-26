# mumrich-vue-memoire

## Install

```bash
# npm
npm install -S mumrich-vue-memoire

# yarn
yarn add mumrich-vue-memoire
```

## Usage

```ts
// define mémoire
import { defineMemoire } from "mumrich-vue-memoire";

// use mémoire
const myMemoire = defineMemoire({
  name: "",
  hobbies: [],
});

// read state
const hobbies = computed(() => myMemoire.state.value.hobbies);

// update state
myMemoire.update((draftState) => {
  draftState.hobbies = [...draftState.hobbies, "programming 👌"];
});
// => state: { name: "", hobbies: ["programming 👌"] }

// undo last update (if any)
myMemoire.undo();
// => state: { name: "", hobbies: [] }

// reapply the last undone upate
myMemoire.redo();
// => new state: { name: "", hobbies: ["programming 👌"] }
```

## Mémoire variations

- `defineMemoire`: the base mémoire implementation providing reacive _state_ and methods for _update_, _undo_ and _redo_.
- `defineMemoireWithBroadcastChannel`: a distributed mémoire that uses the [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel). This is usefull if the state should be shared between _windows_, _tabs_ and _iframes_ with the same [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin).

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
