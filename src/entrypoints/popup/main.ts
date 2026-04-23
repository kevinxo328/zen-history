import '@/assets/style.css';

import { createPinia } from 'pinia';
import { createApp } from 'vue';

import i18n from '@/lib/i18n';
import { CreateWxtPersistPiniaPlugin } from '@/plugins/wxt-persist-pinia-plugin';
import { useUserPreferenceStore } from '@@/stores/user-perference-store';

import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();

pinia.use(CreateWxtPersistPiniaPlugin());
app.use(pinia);

const userPreferenceStore = useUserPreferenceStore(pinia);

app.use(i18n);

userPreferenceStore.$restoreFromStorage().then(() => {
  app.mount('#app');
});
