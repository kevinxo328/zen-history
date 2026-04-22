import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach } from 'vitest';
import { useCleanSettingStore } from '../stores/clean-setting-store';

describe('Clean Setting Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should include browsingDataTypes in the state', () => {
    const store = useCleanSettingStore();
    
    expect(store.browsingDataTypes).toBeDefined();
    expect(store.browsingDataTypes.cookies).toBe(false);
    expect(store.browsingDataTypes.cache).toBe(false);
    expect(store.browsingDataTypes.downloads).toBe(false);
    expect(store.browsingDataTypes.formData).toBe(false);
  });
});
