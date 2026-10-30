import '@/assets/style.css';

import { createPinia } from 'pinia';
import { createApp } from 'vue';

import i18n from '@/lib/i18n';
import { CreateWxtPersistPiniaPlugin } from '@/plugins/wxt-persist-pinia-plugin';
import { useCleanSettingStore } from '@@/stores/clean-setting-store';
import { useUserPreferenceStore } from '@@/stores/user-perference-store';

import Options from './Options.vue';

const app = createApp(Options);
const pinia = createPinia();

pinia.use(CreateWxtPersistPiniaPlugin());
app.use(pinia);

const userPreferenceStore = useUserPreferenceStore(pinia);
const cleanSettingStore = useCleanSettingStore(pinia);

app.use(i18n);

Promise.all([
  userPreferenceStore.$restoreFromStorage(),
  cleanSettingStore.$restoreFromStorage()
]).then(() => {
  app.mount('#app');
});
