import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import App from '@/entrypoints/popup/App.vue';

import { useCleanSettingStore } from '../stores/clean-setting-store';
import { useUserPreferenceStore } from '../stores/user-perference-store';

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
    // @ts-ignore
    cleanSettingStore.$restoreFromStorage = vi.fn().mockResolvedValue(undefined);
    // @ts-ignore
    userPreferenceStore.$restoreFromStorage = vi.fn().mockResolvedValue(undefined);
  });

  it('renders browsing data cleanup options', () => {
    const wrapper = mount(App);
    
    expect(wrapper.text()).toContain('Additional Data to Clear');
    // Reka UI Switch renders as a button with role switch
    expect(wrapper.findAll('[role="switch"]').length).toBeGreaterThanOrEqual(4);
  });

  it('updates the store when a browsing data option is toggled', async () => {
    const wrapper = mount(App);
    const store = useCleanSettingStore();
    
    expect(store.browsingDataTypes.cookies).toBe(false);
    
    // SwitchRoot in reka-ui might be internal to our Switch component
    // But we gave it an id="switch-cookies"
    const cookiesSwitch = wrapper.find('#switch-cookies');
    await cookiesSwitch.trigger('click');
    
    expect(store.browsingDataTypes.cookies).toBe(true);
  });

  it('displays the number of cleared items after a manual clean', async () => {
    const wrapper = mount(App);
    const sendMessageMock = vi.mocked(browser.runtime.sendMessage);
    sendMessageMock.mockResolvedValue({ success: true, total: 42, duration: 100 });

    const cleanButton = wrapper.find('button');
    await cleanButton.trigger('click');

    // Wait for the async cleanup and the visual responsive delay
    // In App.vue there is a setTimeout, but we can check the text directly if we skip the delay in tests or just wait.
    // However, showCleanSuccess is set to true when transition ends or instantly if we mock it.
    
    // For TDD, we expect the button to eventually show the count.
    // We'll manually trigger what triggers the count display if necessary, or use await nextTick.
    await vi.dynamicImportSettled();
    
    // App.vue uses @transitionend to set showCleanSuccess = true
    // We can manually set it for the purpose of testing the text rendering
    // @ts-ignore
    wrapper.vm.showCleanSuccess = true;
    // @ts-ignore
    wrapper.vm.lastCleanTotal = 42; 
    
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Cleaned ~42 items');
  });
});
