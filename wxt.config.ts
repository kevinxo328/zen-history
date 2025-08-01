import {defineConfig} from "wxt";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-vue"],
  outDir: "dist",
  srcDir: "src",
  // @ts-ignore
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    permissions: ["browsingData", "history", "storage", "alarms"],
  },
});
