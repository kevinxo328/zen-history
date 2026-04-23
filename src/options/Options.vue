<script lang="ts" setup>
import { Info, Settings, ShieldAlert } from 'lucide-vue-next';
import { computed, onBeforeMount, ref } from 'vue';

import Button from '@/components/ui/button/Button.vue';
import useI18n from '@/composibles/useI18n';
import useLocaleSync from '@/composibles/useLocaleSync';
import { useCleanSettingStore } from '@@/stores/clean-setting-store';
import { useUserPreferenceStore } from '@@/stores/user-perference-store';

import AboutSettings from './components/AboutSettings.vue';
import AdvancedCleanupSettings from './components/AdvancedCleanupSettings.vue';
import GeneralSettings from './components/GeneralSettings.vue';

const { t } = useI18n();
const cleanSettingStore = useCleanSettingStore();
const userPerferenceStore = useUserPreferenceStore();

const activeTab = ref('general');

const tabs = [
  { id: 'general', label: 'General', icon: Settings, component: GeneralSettings },
  {
    id: 'cleanup',
    label: 'Advanced Cleanup',
    icon: ShieldAlert,
    component: AdvancedCleanupSettings
  },
  { id: 'about', label: 'About', icon: Info, component: AboutSettings }
];

const activeTabConfig = computed(() => tabs.find((tab) => tab.id === activeTab.value));

useLocaleSync(() => userPerferenceStore.locale);

onBeforeMount(async () => {
  // userPreferenceStore is already restored in options-main.ts before mount
  await cleanSettingStore.$restoreFromStorage();
});
</script>

<template>
  <div class="bg-background text-foreground flex h-screen w-full overflow-hidden font-sans">
    <!-- Sidebar -->
    <aside class="bg-card/10 flex w-[300px] flex-col border-r p-8 lg:p-12">
      <div class="mb-16 flex flex-col items-center gap-y-4 text-center">
        <div
          class="border-border/10 rounded-2xl border bg-white p-2 shadow-md transition-transform hover:scale-110"
        >
          <img src="@/assets/Logo.svg" class="size-8" alt="logo" />
        </div>
        <h1 class="text-primary text-xl font-black tracking-tighter uppercase">ZEN HISTORY</h1>
      </div>

      <nav class="flex-1 space-y-3">
        <Button
          v-for="tab in tabs"
          :key="tab.id"
          :variant="activeTab === tab.id ? 'secondary' : 'ghost'"
          class="h-14 w-full justify-start gap-x-4 rounded-2xl px-6 text-base font-black transition-all"
          :class="
            activeTab === tab.id
              ? 'scale-[1.02] shadow-xl'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          "
          @click="activeTab = tab.id"
        >
          <component :is="tab.icon" class="size-5" />
          {{ t(tab.label) }}
        </Button>
      </nav>

      <div class="border-border/30 mt-auto border-t pt-8 opacity-20">
        <div class="flex items-center justify-center gap-x-2">
          <div class="bg-primary size-1 rounded-full" />
          <div class="bg-primary size-1 rounded-full" />
          <div class="bg-primary size-1 rounded-full" />
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="bg-background flex-1 overflow-y-auto p-12 lg:p-24 lg:pt-20">
      <div class="mx-auto max-w-3xl space-y-16">
        <header class="space-y-2">
          <h2 class="text-4xl leading-none font-black tracking-tighter">
            {{ t(activeTabConfig?.label || '') }}
          </h2>
          <p class="text-muted-foreground max-w-xl text-base font-medium">
            {{ t('Configure your browsing experience and privacy settings.') }}
          </p>
        </header>

        <transition
          mode="out-in"
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform translate-y-8 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="transform translate-y-0 opacity-100"
          leave-to-class="transform translate-y-8 opacity-0"
        >
          <component :is="activeTabConfig?.component" />
        </transition>
      </div>
    </main>
  </div>
</template>
