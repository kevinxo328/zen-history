<script lang="ts" setup>
import { Check, Languages, Moon, Sun } from 'lucide-vue-next';
import { onBeforeMount } from 'vue';

import Button from '@/components/ui/button/Button.vue';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import useI18n from '@/composibles/useI18n';
import { Locale } from '@/types/user-perference';
import { useCleanSettingStore } from '@@/stores/clean-setting-store';
import { useUserPreferenceStore } from '@@/stores/user-perference-store';

const { t } = useI18n();
const cleanSettingStore = useCleanSettingStore();
const userPerferenceStore = useUserPreferenceStore();

onBeforeMount(async () => {
  await cleanSettingStore.$restoreFromStorage();
  await userPerferenceStore.$restoreFromStorage();
});
</script>

<template>
  <main class="container mx-auto max-w-2xl p-6">
    <header class="mb-8 flex items-center justify-between">
      <div class="flex items-center gap-x-3">
        <img src="@/assets/Logo.svg" class="size-10" alt="logo" />
        <h1 class="text-2xl font-bold">Zen History {{ t('Settings') }}</h1>
      </div>
      <Button variant="outline" size="icon" @click="userPerferenceStore.toggleTheme">
        <Moon v-if="userPerferenceStore.isDarkTheme" class="size-5" />
        <Sun v-else class="size-5" />
      </Button>
    </header>

    <div class="grid gap-6">
      <Card>
        <CardContent class="pt-6">
          <div class="mb-4 flex items-center gap-x-2">
            <Check class="size-5" />
            <h3 class="text-lg font-bold">{{ t('Additional Data to Clear') }}</h3>
          </div>
          <p class="mb-6 text-foreground/60 text-sm">
            {{ t('Select additional browsing data types to clear during cleanup.') }}
          </p>
          <div class="grid gap-y-4">
            <div
              v-for="type in ['cookies', 'cache', 'downloads', 'formData']"
              :key="type"
              class="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div class="grid gap-y-0.5">
                <Label :for="`switch-${type}`" class="cursor-pointer font-medium">
                  {{
                    t(
                      type === 'cookies'
                        ? 'Cookies'
                        : type === 'cache'
                          ? 'Cache'
                          : type === 'downloads'
                            ? 'Downloads'
                            : 'Form Data'
                    )
                  }}
                </Label>
              </div>
              <Switch
                :id="`switch-${type}`"
                v-model="cleanSettingStore.browsingDataTypes[type as keyof typeof cleanSettingStore.browsingDataTypes]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="pt-6">
          <div class="mb-4 flex items-center gap-x-2">
            <Languages class="size-5" />
            <h3 class="text-lg font-bold">{{ t('Interface Language') }}</h3>
          </div>
          <div class="flex items-center justify-between rounded-lg border p-4">
            <Label class="font-medium">{{ t('Language') }}</Label>
            <Select
              :model-value="userPerferenceStore.locale"
              @update:model-value="(val) => userPerferenceStore.setLocale(val as Locale)"
            >
              <SelectTrigger class="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="Locale.EN">{{ t('English') }}</SelectItem>
                <SelectItem :value="Locale.ZH_TW">{{ t('Chinese (Traditional)') }}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  </main>
</template>
