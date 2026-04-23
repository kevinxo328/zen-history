<script lang="ts" setup>
import { Languages } from 'lucide-vue-next';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import useI18n from '@/composibles/useI18n';
import { Locale } from '@/types/user-perference';
import { useUserPreferenceStore } from '@@/stores/user-perference-store';

const { t } = useI18n();
const userPreferenceStore = useUserPreferenceStore();
</script>

<template>
  <div class="space-y-12">
    <!-- Language Section -->
    <section class="space-y-8">
      <div class="flex items-center gap-x-2 border-b pb-2">
        <Languages class="text-primary size-5" />
        <h3 class="text-lg font-bold">{{ t('Interface Language') }}</h3>
      </div>

      <div class="flex items-center justify-between py-2">
        <div class="space-y-1">
          <Label class="text-base font-semibold">{{ t('Language') }}</Label>
          <p class="text-muted-foreground text-sm">
            {{ t('Select your preferred language for the interface.') }}
          </p>
        </div>
        <Select
          :model-value="userPreferenceStore.locale"
          @update:model-value="(val) => userPreferenceStore.setLocale(val as Locale)"
        >
          <SelectTrigger class="bg-background h-11 w-[200px] rounded-xl shadow-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem :value="Locale.EN">English</SelectItem>
            <SelectItem :value="Locale.ZH_TW">繁體中文</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </section>
  </div>
</template>
