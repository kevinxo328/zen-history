import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Options from '@/options/Options.vue';
import { Locale } from '@/types/user-perference';

import { useCleanSettingStore } from '../stores/clean-setting-store';
import { useUserPreferenceStore } from '../stores/user-perference-store';

// Mock i18n
vi.mock('@/composibles/useI18n', () => ({
  default: () => ({
    t: (key: string) => key
  })
}));

// Mock i18n instance used in stores
vi.mock('@/lib/i18n', () => ({
  default: {
    global: {
      locale: {
        value: 'en'
      }
    }
  }
}));

describe('Options.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    const cleanSettingStore = useCleanSettingStore();
    const userPreferenceStore = useUserPreferenceStore();
    cleanSettingStore.$restoreFromStorage = vi.fn().mockResolvedValue(undefined);
    userPreferenceStore.$restoreFromStorage = vi.fn().mockResolvedValue(undefined);
  });

  it('renders browsing data cleanup options', async () => {
    const wrapper = mount(Options);

    // Switch to cleanup tab
    const cleanupTab = wrapper.findAll('button').find(b => b.text().includes('Advanced Cleanup'));
    await cleanupTab?.trigger('click');

    expect(wrapper.text()).toContain('Additional Data to Clear');
    // Reka UI Switch renders as a button with role switch
    expect(wrapper.findAll('[role="switch"]').length).toBeGreaterThanOrEqual(4);
  });

  it('updates the store when a browsing data option is toggled', async () => {
    const wrapper = mount(Options);
    const store = useCleanSettingStore();

    // Switch to cleanup tab
    const cleanupTab = wrapper.findAll('button').find(b => b.text().includes('Advanced Cleanup'));
    await cleanupTab?.trigger('click');

    expect(store.browsingDataTypes.cookies).toBe(false);

    const cookiesSwitch = wrapper.find('#switch-cookies');
    await cookiesSwitch.trigger('click');

    expect(store.browsingDataTypes.cookies).toBe(true);
  });

  it('renders language selection options', () => {
    const wrapper = mount(Options);
    expect(wrapper.text()).toContain('Interface Language');
    expect(wrapper.text()).toContain('Language');
  });

  it('updates the store when language is changed', async () => {
    const wrapper = mount(Options);
    const store = useUserPreferenceStore();

    const setLocaleSpy = vi.spyOn(store, 'setLocale');

    const select = wrapper.findComponent({ name: 'Select' });
    await select.vm.$emit('update:modelValue', Locale.ZH_TW);

    expect(setLocaleSpy).toHaveBeenCalledWith(Locale.ZH_TW);
  });
});
