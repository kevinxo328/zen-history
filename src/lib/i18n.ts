import {createI18n} from "vue-i18n";
// Use your default locale when importing the schema
import type schema from "~/assets/locales/en.json";
import messages from "@intlify/unplugin-vue-i18n/messages";

export type I18nSchema = typeof schema;
export type I18nLocales = "en" | "zh_TW";

function detectLocale(): I18nLocales {
  const lang = navigator.language || navigator.languages[0] || "en";

  if (lang.startsWith("zh-TW")) return "zh_TW";
  return "en";
}

export default createI18n<[I18nSchema], I18nLocales>({
  locale: detectLocale(), // Default locale
  fallbackLocale: "en", // Fallback locale
  messages: messages as any,
});
