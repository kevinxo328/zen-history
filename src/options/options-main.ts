import '@/assets/style.css';

import { createPinia } from 'pinia';
import { createApp } from 'vue';

import i18n from '@/lib/i18n';
import { CreateWxtPersistPiniaPlugin } from '@/plugins/wxt-persist-pinia-plugin';
import { Theme } from '@/types/user-perference';
import { useUserPreferenceStore } from '@@/stores/user-perference-store';

import Options from './Options.vue';

const app = createApp(Options);
const pinia = createPinia();

pinia.use(CreateWxtPersistPiniaPlugin());
app.use(pinia);

// Apply the initial theme based on user preference
useUserPreferenceStore(pinia).$subscribe(
  (mutation, state) => {
    if (mutation.storeId === 'userPreference') {
      if (state.theme === Theme.DARK) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },
  { flush: 'sync', immediate: true }
);

app.use(i18n);
app.mount('#app');
