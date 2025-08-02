import {defineConfig} from "wxt";
import tailwindcss from "@tailwindcss/vite";
import version from "vite-plugin-package-version";
import vueI18n from "@intlify/unplugin-vue-i18n/vite";
import path from "path";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-vue"],
  outDir: "dist",
  srcDir: "src",
  // @ts-ignore
  vite: () => ({
    plugins: [
      tailwindcss(),
      version(),
      vueI18n({
        include: [path.resolve(__dirname, "src/assets/locales/**")],
      }),
    ],
  }),
  manifest: {
    permissions: ["history", "storage", "alarms"],
    name: "__MSG_extName__",
    description: "__MSG_extDescription__",
    default_locale: "en",
  },
});
