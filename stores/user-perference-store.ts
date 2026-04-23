import { defineStore } from 'pinia';

import i18n from '@/lib/i18n';
import { Locale, Theme } from '@/types/user-perference';

function getDefaultTheme(): Theme {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.DARK : Theme.LIGHT;
  }
  return Theme.LIGHT;
}

export const useUserPreferenceStore = defineStore('userPreference', {
  state: () => ({
    theme: getDefaultTheme(),
    // @ts-ignore - vue-i18n type mismatch in global instance
    locale: (i18n.global.locale.value || i18n.global.locale) as Locale
  }),
  getters: {
    isDarkTheme: (state) => state.theme === Theme.DARK
  },
  actions: {
    toggleTheme() {
      this.theme = this.theme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
    },
    setLocale(locale: Locale) {
      this.locale = locale;
      // @ts-ignore - vue-i18n type mismatch in global instance
      const globalLocale = i18n.global.locale as any;
      if (globalLocale.value !== undefined) {
        globalLocale.value = locale;
      } else {
        i18n.global.locale = locale as any;
      }
    }
  }
});
