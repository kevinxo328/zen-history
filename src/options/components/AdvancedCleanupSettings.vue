<script lang="ts" setup>
import { ShieldCheck } from 'lucide-vue-next';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import useI18n from '@/composibles/useI18n';
import type { BrowsingDataTypes } from '@/types/clean-settings';
import { useCleanSettingStore } from '@@/stores/clean-setting-store';

const { t } = useI18n();
const cleanSettingStore = useCleanSettingStore();

const dataTypes: { id: keyof BrowsingDataTypes; label: string; desc: string }[] = [
  { id: 'cookies', label: 'Cookies', desc: 'Clear browsing cookies from all sites.' },
  { id: 'cache', label: 'Cache', desc: 'Clear cached images and files.' },
  { id: 'downloads', label: 'Downloads', desc: 'Clear download history (files remain on disk).' },
  { id: 'formData', label: 'Form Data', desc: 'Clear saved form data and passwords.' }
];
</script>

<template>
  <div class="space-y-10">
    <header class="space-y-3">
      <div class="flex items-center gap-x-2 border-b pb-2">
        <ShieldCheck class="text-primary size-5" />
        <h3 class="text-lg font-bold">{{ t('Additional Data to Clear') }}</h3>
      </div>
      <p class="text-muted-foreground pt-2 text-base leading-relaxed">
        {{
          t(
            'Select additional browsing data types to clear during cleanup. This helps maintain a completely clean history.'
          )
        }}
      </p>
    </header>

    <div class="border-border/50 divide-y border-t border-b">
      <div
        v-for="type in dataTypes"
        :key="type.id"
        class="hover:bg-muted/30 -mx-6 flex items-center justify-between rounded-2xl px-6 py-8 transition-colors"
      >
        <div class="grid gap-y-1">
          <Label :for="`switch-${type.id}`" class="cursor-pointer text-lg font-bold">
            {{ t(type.label) }}
          </Label>
          <p class="text-muted-foreground text-sm">{{ t(type.desc) }}</p>
        </div>
        <Switch
          :id="`switch-${type.id}`"
          v-model="cleanSettingStore.browsingDataTypes[type.id]"
          class="scale-125"
        />
      </div>
    </div>
  </div>
</template>
