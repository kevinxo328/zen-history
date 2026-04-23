<script lang="ts" setup>
import { Info, ShieldCheck } from 'lucide-vue-next';
import { computed } from 'vue';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import useI18n from '@/composibles/useI18n';
import { type BrowsingDataTypes, TimeRangeType } from '@/types/clean-settings';
import { useCleanSettingStore } from '@@/stores/clean-setting-store';

const { t } = useI18n();
const cleanSettingStore = useCleanSettingStore();

const isKeepRecentMode = computed(
  () => cleanSettingStore.timeRange.type === TimeRangeType.KEEP_RECENT
);

const dataTypes: { id: keyof BrowsingDataTypes; label: string; desc: string }[] = [
  {
    id: 'cookies',
    label: 'Cookies',
    desc: 'Clear browsing cookies from all sites. This will sign you out of most websites.'
  },
  { id: 'cache', label: 'Cache', desc: 'Clear cached images and files to free up space.' },
  {
    id: 'downloads',
    label: 'Downloads',
    desc: 'Clear download history (downloaded files remain on disk).'
  },
  { id: 'formData', label: 'Form Data', desc: 'Clear saved form data used for auto-fill.' }
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

      <!-- API Limitation Warning -->
      <div
        v-if="cleanSettingStore.timeRange.type === TimeRangeType.KEEP_RECENT"
        data-testid="browsing-data-warning"
        class="bg-warning/10 border-warning/30 mt-4 flex items-start gap-x-4 rounded-2xl border p-6"
      >
        <Info class="text-warning mt-1 size-5 shrink-0" />
        <p class="text-warning-foreground text-sm leading-relaxed font-medium">
          {{ t('Browsing data limitation warning') }}
        </p>
      </div>
    </header>

    <div class="border-border/50 divide-y border-t border-b">
      <div
        v-for="type in dataTypes"
        :key="type.id"
        class="-mx-6 flex items-center justify-between rounded-2xl px-6 py-8 transition-colors"
        :class="isKeepRecentMode ? 'opacity-50' : 'hover:bg-muted/30'"
      >
        <div class="grid gap-y-1">
          <Label
            :for="`switch-${type.id}`"
            class="text-lg font-bold"
            :class="isKeepRecentMode ? 'cursor-not-allowed' : 'cursor-pointer'"
          >
            {{ t(type.label) }}
          </Label>
          <p class="text-muted-foreground text-sm">{{ t(type.desc) }}</p>
        </div>
        <Switch
          :id="`switch-${type.id}`"
          v-model="cleanSettingStore.browsingDataTypes[type.id]"
          class="scale-125"
          :disabled="isKeepRecentMode"
        />
      </div>
    </div>
  </div>
</template>
