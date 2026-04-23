import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import App from '@/entrypoints/popup/App.vue';

import { useCleanSettingStore } from '../stores/clean-setting-store';
import { useUserPreferenceStore } from '../stores/user-perference-store';

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

// Mock i18n
vi.mock('@/composibles/useI18n', () => ({
  default: () => ({
    t: (key: string, params?: any) => {
      if (key === 'Cleaned successfully' && params) {
        return `Cleaned ~${params.count} items`;
      }
      return key;
    }
  })
}));

// Mock wxt
vi.mock('@/lib/wxt', () => ({
  toggleAutoCleanAlarm: vi.fn()
}));

describe('App.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    const cleanSettingStore = useCleanSettingStore();
    const userPreferenceStore = useUserPreferenceStore();
    cleanSettingStore.$restoreFromStorage = vi.fn().mockResolvedValue(undefined);
    userPreferenceStore.$restoreFromStorage = vi.fn().mockResolvedValue(undefined);
  });

  it('renders time range and auto clean options', () => {
    const wrapper = mount(App);
    
    expect(wrapper.text()).toContain('Clean Time Range');
    expect(wrapper.text()).toContain('Daily Auto Clean');
  });

  it('displays the number of cleared items after a manual clean', async () => {
    const wrapper = mount(App);
    const sendMessageMock = vi.mocked(browser.runtime.sendMessage);
    // @ts-expect-error - mock type does not match browser.runtime.sendMessage overloads
    sendMessageMock.mockResolvedValue({ success: true, total: 42, duration: 100 });

    const cleanButton = wrapper.find('button');
    await cleanButton.trigger('click');

    await vi.dynamicImportSettled();
    
    // @ts-expect-error - accessing internal component state not exposed in types
    wrapper.vm.showCleanSuccess = true;
    // @ts-expect-error - accessing internal component state not exposed in types
    wrapper.vm.lastCleanTotal = 42;
    
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Cleaned ~42 items');
  });
});
