<script lang="ts" setup>
import { Info, Settings, ShieldAlert } from 'lucide-vue-next';
import { computed, onBeforeMount, ref, watch } from 'vue';

import Button from '@/components/ui/button/Button.vue';
import useI18n from '@/composibles/useI18n';
import i18n from '@/lib/i18n';
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
  { id: 'cleanup', label: 'Advanced Cleanup', icon: ShieldAlert, component: AdvancedCleanupSettings },
  { id: 'about', label: 'About', icon: Info, component: AboutSettings }
];

const activeTabConfig = computed(() => tabs.find((tab) => tab.id === activeTab.value));

// Sync i18n with store locale
watch(
  () => userPerferenceStore.locale,
  (newLocale) => {
    if (!newLocale) return;
    const globalLocale = i18n.global.locale as any;
    if (globalLocale.value !== undefined) {
      globalLocale.value = newLocale;
    } else {
      i18n.global.locale = newLocale as any;
    }
  },
  { immediate: true }
);

onBeforeMount(async () => {
  // userPreferenceStore is already restored in options-main.ts before mount
  await cleanSettingStore.$restoreFromStorage();
});
</script>

<template>
  <div class="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
    <!-- Sidebar -->
    <aside class="w-[300px] border-r bg-card/10 flex flex-col p-8 lg:p-12">
      <div class="mb-16 flex flex-col items-center gap-y-4 text-center">
        <div class="p-2 bg-white rounded-2xl shadow-md border border-border/10 transition-transform hover:scale-110">
          <img src="@/assets/Logo.svg" class="size-8" alt="logo" />
        </div>
        <h1 class="text-xl font-black tracking-tighter text-primary uppercase">ZEN HISTORY</h1>
      </div>

      <nav class="flex-1 space-y-3">
        <Button
          v-for="tab in tabs"
          :key="tab.id"
          :variant="activeTab === tab.id ? 'secondary' : 'ghost'"
          class="w-full justify-start gap-x-4 h-14 px-6 text-base font-black transition-all rounded-2xl"
          :class="activeTab === tab.id ? 'shadow-xl scale-[1.02]' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'"
          @click="activeTab = tab.id"
        >
          <component :is="tab.icon" class="size-5" />
          {{ t(tab.label) }}
        </Button>
      </nav>

      <div class="mt-auto pt-8 border-t border-border/30 opacity-20">
        <div class="flex items-center justify-center gap-x-2">
          <div class="size-1 bg-primary rounded-full" />
          <div class="size-1 bg-primary rounded-full" />
          <div class="size-1 bg-primary rounded-full" />
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto bg-background p-12 lg:p-24 lg:pt-20">
      <div class="max-w-3xl mx-auto space-y-16">
        <header class="space-y-2">
          <h2 class="text-4xl font-black tracking-tighter leading-none">
            {{ t(activeTabConfig?.label || '') }}
          </h2>
          <p class="text-muted-foreground text-base font-medium max-w-xl">
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
