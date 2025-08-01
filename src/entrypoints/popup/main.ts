import {createApp} from "vue";
import "./style.css";
import App from "./App.vue";
import {createPinia} from "pinia";
import {CreateWxtPersistPiniaPlugin} from "@/plugins/wxt-persist-pinia-plugin";
import {useCleanSettingStore} from "@@/stores/clean-setting-store";

const app = createApp(App);
const pinia = createPinia();

pinia.use(CreateWxtPersistPiniaPlugin());
app.use(pinia);

await useCleanSettingStore(pinia).$restoreFromStorage();

app.mount("#app");
