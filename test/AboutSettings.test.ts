import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import AboutSettings from '@/options/components/AboutSettings.vue';

// Mock import.meta.env.PACKAGE_VERSION
vi.stubGlobal('import.meta', {
  env: {
    PACKAGE_VERSION: '0.2.0'
  }
});

// Mock i18n
vi.mock('@/composibles/useI18n', () => ({
  default: () => ({
    t: (key: string) => key
  })
}));

// Mock browser runtime
const browser = {
  runtime: {
    getManifest: () => ({
      version: '0.2.0'
    })
  }
};
vi.stubGlobal('browser', browser);

describe('AboutSettings.vue', () => {
  it('renders version info', () => {
    const wrapper = mount(AboutSettings);
    expect(wrapper.text()).toContain('About');
    expect(wrapper.text()).toContain('Version');
    expect(wrapper.text()).toContain('0.2.0');
  });

  it('renders feedback and support links', () => {
    const wrapper = mount(AboutSettings);
    expect(wrapper.text()).toContain('Feedback & Support');
    expect(wrapper.text()).toContain('Rate on Web Store');
    expect(wrapper.text()).toContain('Report an Issue');

    const links = wrapper.findAll('a');
    expect(links.length).toBe(2);

    const storeLink = links.find((l) => l.attributes('href')?.includes('chromewebstore'));
    expect(storeLink).toBeDefined();

    const bugLink = links.find((l) => l.attributes('href')?.includes('github.com'));
    expect(bugLink).toBeDefined();
    expect(bugLink?.attributes('href')).toBe(
      'https://github.com/kevinxo328/zen-history/issues/new?template=bug_report.yml'
    );
  });
});
