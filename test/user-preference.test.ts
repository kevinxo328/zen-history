import { createPinia,setActivePinia } from 'pinia';
import { beforeEach,describe, expect, it } from 'vitest';

import i18n from '../src/lib/i18n';
import { Locale } from '../src/types/user-perference';
import { useUserPreferenceStore } from '../stores/user-perference-store';

describe('UserPreferenceStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should update locale and i18n instance', () => {
    const store = useUserPreferenceStore();
    store.setLocale(Locale.ZH_TW);
    expect(store.locale).toBe(Locale.ZH_TW);
    // @ts-ignore
    expect(i18n.global.locale.value || i18n.global.locale).toBe(Locale.ZH_TW);
    
    store.setLocale(Locale.EN);
    expect(store.locale).toBe(Locale.EN);
    // @ts-ignore
    expect(i18n.global.locale.value || i18n.global.locale).toBe(Locale.EN);
  });
});
