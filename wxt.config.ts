import {defineConfig} from "wxt";
import tailwindcss from "@tailwindcss/vite";
import version from "vite-plugin-package-version";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-vue"],
  outDir: "dist",
  srcDir: "src",
  // @ts-ignore
  vite: () => ({
    plugins: [tailwindcss(), version()],
  }),
  manifest: {
    permissions: ["browsingData", "history", "storage", "alarms"],
  },
});
