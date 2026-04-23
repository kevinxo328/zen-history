import { defineStore } from 'pinia';

import { getI18nLocale, setI18nLocale } from '@/lib/locale';
import { Locale } from '@/types/user-perference';

export const useUserPreferenceStore = defineStore('userPreference', {
  state: () => ({
    locale: getI18nLocale()
  }),
  actions: {
    setLocale(locale: Locale) {
      this.locale = locale;
      setI18nLocale(locale);
    }
  }
});
