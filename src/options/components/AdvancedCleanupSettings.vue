<script lang="ts" setup>
import { ShieldCheck } from 'lucide-vue-next';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import useI18n from '@/composibles/useI18n';
import { useCleanSettingStore } from '@@/stores/clean-setting-store';

const { t } = useI18n();
const cleanSettingStore = useCleanSettingStore();

const dataTypes = [
  { id: 'cookies', label: 'Cookies', desc: 'Clear browsing cookies from all sites.' },
  { id: 'cache', label: 'Cache', desc: 'Clear cached images and files.' },
  { id: 'downloads', label: 'Downloads', desc: 'Clear download history (files remain on disk).' },
  { id: 'formData', label: 'Form Data', desc: 'Clear saved form data and passwords.' }
];
</script>

<template>
  <div class="space-y-10">
    <header class="space-y-3">
      <div class="flex items-center gap-x-2 pb-2 border-b">
        <ShieldCheck class="size-5 text-primary" />
        <h3 class="text-lg font-bold">{{ t('Additional Data to Clear') }}</h3>
      </div>
      <p class="text-muted-foreground text-base leading-relaxed pt-2">
        {{ t('Select additional browsing data types to clear during cleanup. This helps maintain a completely clean history.') }}
      </p>
    </header>

    <div class="divide-y border-t border-b border-border/50">
      <div
        v-for="type in dataTypes"
        :key="type.id"
        class="flex items-center justify-between py-8 transition-colors hover:bg-muted/30 px-6 -mx-6 rounded-2xl"
      >
        <div class="grid gap-y-1">
          <Label :for="`switch-${type.id}`" class="cursor-pointer text-lg font-bold">
            {{ t(type.label) }}
          </Label>
          <p class="text-sm text-muted-foreground">{{ t(type.desc) }}</p>
        </div>
        <Switch
          :id="`switch-${type.id}`"
          v-model="cleanSettingStore.browsingDataTypes[type.id as keyof typeof cleanSettingStore.browsingDataTypes]"
          class="scale-125"
        />
      </div>
    </div>
  </div>
</template>
