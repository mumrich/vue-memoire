import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

const libName = "mumrich-vue-memoire";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      outputDir: "dist/types",
      insertTypesEntry: true,
      staticImport: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/lib.ts"),
      name: libName,
      fileName: (format) => `${libName}.${format}.js`,
    },
    rollupOptions: {
      external: ["vue", "immer", "uuid", "@vueuse/core"],
      output: {
        // Provide global variables to use in the UMD build
        // Add external deps here
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
