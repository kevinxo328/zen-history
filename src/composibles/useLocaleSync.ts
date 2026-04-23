import { watch } from 'vue';

import { setI18nLocale } from '@/lib/locale';
import { Locale } from '@/types/user-perference';

export default function useLocaleSync(getLocale: () => Locale | undefined) {
  watch(
    getLocale,
    (newLocale) => {
      if (!newLocale) return;
      setI18nLocale(newLocale);
    },
    { immediate: true }
  );
}
