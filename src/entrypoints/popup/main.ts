import {createApp} from "vue";
import "./style.css";
import App from "./App.vue";
import {createPinia} from "pinia";
import {CreateWxtPersistPiniaPlugin} from "@/plugins/wxt-persist-pinia-plugin";
import {useUserPreferenceStore} from "@@/stores/user-perference-store";
import {Theme} from "@/types/user-perference";
import i18n from "@/lib/i18n";

const app = createApp(App);
const pinia = createPinia();

pinia.use(CreateWxtPersistPiniaPlugin());
app.use(pinia);

// Apply the initial theme based on user preference
useUserPreferenceStore(pinia).$subscribe(
  (mutation, state) => {
    if (mutation.storeId === "userPreference") {
      if (state.theme === Theme.DARK) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  },
  {flush: "sync", immediate: true}
);

app.use(i18n);
app.mount("#app");
