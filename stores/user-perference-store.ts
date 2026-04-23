import { defineStore } from 'pinia';

import i18n from '@/lib/i18n';
import { Locale } from '@/types/user-perference';

export const useUserPreferenceStore = defineStore('userPreference', {
  state: () => ({
    // @ts-expect-error - vue-i18n type mismatch in global instance
    locale: (i18n.global.locale.value || i18n.global.locale) as Locale
  }),
  actions: {
    setLocale(locale: Locale) {
      this.locale = locale;
      const globalLocale = i18n.global.locale as any;
      if (globalLocale.value !== undefined) {
        globalLocale.value = locale;
      } else {
        i18n.global.locale = locale as any;
      }
    }
  }
});
