import messages from '@intlify/unplugin-vue-i18n/messages';
import { createI18n } from 'vue-i18n';

// Use your default locale when importing the schema
import type schema from '~/assets/locales/en.json';

export type I18nSchema = typeof schema;
export type I18nLocales = 'en' | 'zh_TW';

function detectLocale(): I18nLocales {
  const lang = navigator.language || navigator.languages[0] || 'en';

  if (lang.startsWith('zh-TW')) return 'zh_TW';
  return 'en';
}

const i18n = createI18n<[I18nSchema], I18nLocales>({
  legacy: false,
  locale: detectLocale(), // Default locale
  fallbackLocale: 'en', // Fallback locale
  messages: messages as Record<I18nLocales, I18nSchema>
});

export default i18n;
