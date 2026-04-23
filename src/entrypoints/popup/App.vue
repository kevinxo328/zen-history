<script lang="ts" setup>
import { Check, Clock, LoaderCircle, Moon, Settings, Sun, Zap } from 'lucide-vue-next';
import { onBeforeMount, ref, toRaw } from 'vue';

import Button from '@/components/ui/button/Button.vue';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import useI18n from '@/composibles/useI18n';
import { formatMsToTimeString, formatRelativeTimeI18n } from '@/lib/utils';
import { toggleAutoCleanAlarm } from '@/lib/wxt';
import { CleanMessage } from '@/types/background';
import {
  KeepRecentValue,
  RemoveRecentValue,
  TimeRange,
  TimeRangeType
} from '@/types/clean-settings';
import { useCleanSettingStore } from '@@/stores/clean-setting-store';
import { useUserPreferenceStore } from '@@/stores/user-perference-store';

const VERSION = import.meta.env.PACKAGE_VERSION;

const { t } = useI18n();
const cleanSettingStore = useCleanSettingStore();
const userPerferenceStore = useUserPreferenceStore();
const isCleaning = ref(false);
const showCleanSuccess = ref(false);
const lastCleanTotal = ref(0);

const setDefaultTimeRangeValue = () => {
  if (cleanSettingStore.timeRange.type === TimeRangeType.KEEP_RECENT) {
    cleanSettingStore.timeRange.value = KeepRecentValue.ONE_MONTH;
  } else {
    cleanSettingStore.timeRange.value = RemoveRecentValue.PAST_ONE_MONTH;
  }
};

const handleClean = async (timeRange: TimeRange) => {
  const startTime = performance.now();
  isCleaning.value = true;
  showCleanSuccess.value = false;
  try {
    const response = await browser.runtime.sendMessage(
      new CleanMessage(timeRange, toRaw(cleanSettingStore.browsingDataTypes))
    );
    if (response && response.success) {
      lastCleanTotal.value = response.total;
    }
  } catch (error) {
    console.error('Error during cleaning:', error);
  } finally {
    const endTime = performance.now();
    const duration = endTime - startTime;

    // Ensure the cleaning process is visually responsive
    setTimeout(
      () => {
        isCleaning.value = false;
      },
      duration > 1000 ? 0 : 1000
    );
  }
};

const openOptionsPage = () => {
  browser.runtime.openOptionsPage();
};

onBeforeMount(async () => {
  // Restore settings from storage when the component is mounted
  await cleanSettingStore.$restoreFromStorage();
  await userPerferenceStore.$restoreFromStorage();
});
</script>

<template>
  <main class="container flex min-w-[350px] flex-col gap-y-3 p-4">
    <header class="flex items-center justify-between">
      <div class="flex items-center gap-x-2">
        <img src="@/assets/Logo.svg" class="size-8" alt="logo" />
        <div>
          <h1 class="text-[1.2rem] leading-none font-bold">Zen History</h1>
          <span class="text-foreground/60"> v{{ VERSION }} </span>
        </div>
      </div>
      <div class="flex items-center gap-x-2">
        <Button variant="outline" size="icon" @click="openOptionsPage">
          <Settings class="size-4" />
        </Button>
        <Button variant="outline" size="icon" @click="userPerferenceStore.toggleTheme">
          <Moon v-if="userPerferenceStore.isDarkTheme" class="size-4" />
          <Sun v-else class="size-4" />
        </Button>
      </div>
    </header>

    <Card>
      <CardContent>
        <div class="mb-3 flex items-center gap-x-2">
          <Clock class="size-4" />
          <h3 class="text-sm font-bold">{{ t('Clean Time Range') }}</h3>
        </div>

        <RadioGroup
          v-model="cleanSettingStore.timeRange.type"
          class="mb-3"
          @update:model-value="setDefaultTimeRangeValue"
        >
          <div
            v-for="key in [TimeRangeType.KEEP_RECENT, TimeRangeType.REMOVE_RECENT]"
            :key="key"
            class="flex items-center space-x-2"
          >
            <RadioGroupItem :id="`option-${key}`" :value="key" />
            <Label :for="`option-${key}`" class="cursor-pointer text-xs">
              {{
                key === TimeRangeType.KEEP_RECENT
                  ? t('Keep recent history and delete older')
                  : t('Delete history within specified time range')
              }}
            </Label>
          </div>
        </RadioGroup>
        <Label class="mb-1 cursor-pointer text-xs">
          {{
            cleanSettingStore.timeRange.type === TimeRangeType.KEEP_RECENT
              ? t('Select how long to keep')
              : t('Select time range to remove')
          }}
        </Label>
        <Select
          v-if="cleanSettingStore.timeRange.type === TimeRangeType.KEEP_RECENT"
          v-model="cleanSettingStore.timeRange.value"
        >
          <SelectTrigger class="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="option in Object.values(KeepRecentValue)" :key="option" :value="option">
                {{ t(option) }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          v-else-if="cleanSettingStore.timeRange.type === TimeRangeType.REMOVE_RECENT"
          v-model="cleanSettingStore.timeRange.value"
        >
          <SelectTrigger class="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="option in Object.values(RemoveRecentValue)" :key="option" :value="option">
                {{ t(option) }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>

    <Card>
      <CardContent>
        <div class="mb-2 flex items-center justify-between">
          <div class="flex items-center gap-x-2">
            <Zap class="size-4" />
            <h3 class="text-sm font-bold">{{ t('Auto Clean Schedule') }}</h3>
          </div>
          <Switch v-model="cleanSettingStore.autoClean.enabled" @update:model-value="toggleAutoCleanAlarm" />
        </div>
        <p>
          {{
            cleanSettingStore.autoClean.enabled
              ? t('Auto clean will run daily at 12:00 AM')
              : t('Auto clean is disabled')
          }}
        </p>
        <div v-if="cleanSettingStore.analytics.lastAutoCleanTimestamp" class="mt-2 flex flex-col gap-y-1 text-sm">
          <div class="flex items-center justify-between">
            <span class="text-foreground/70">{{ t('Last executed') }}</span>
            <span class="font-bold">
              {{ formatRelativeTimeI18n(cleanSettingStore.analytics.lastAutoCleanTimestamp, t) }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-foreground/70">{{ t('Duration') }}</span>
            <span class="font-bold">
              {{
                formatMsToTimeString(cleanSettingStore.analytics.lastAutoCleanDuration) ===
                  '00:00:00'
                  ? t('< 1 second') : formatMsToTimeString(cleanSettingStore.analytics.lastAutoCleanDuration) }} </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-foreground/70">{{ t('Total cleaned') }}</span>
            <span class="font-bold">
              ~{{ Intl.NumberFormat().format(cleanSettingStore.analytics.lastAutoCleanTotal) }}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>

    <div class="flex flex-col gap-y-2">
      <Button
        :disabled="isCleaning || showCleanSuccess"
        :class="[isCleaning ? 'w-10' : 'w-full', showCleanSuccess ? 'opacity-100!' : '']"
        class="m-auto rounded-full transition-[width] duration-500 ease-out" @click="
          handleClean(
            cleanSettingStore.timeRange.type === TimeRangeType.KEEP_RECENT
              ? {
                type: TimeRangeType.KEEP_RECENT,
                value: cleanSettingStore.timeRange.value
              }
              : {
                type: TimeRangeType.REMOVE_RECENT,
                value: cleanSettingStore.timeRange.value
              }
          )
          " @transitionend="showCleanSuccess = true">
        <LoaderCircle v-if="isCleaning" class="animate-spin" />
        <p
          v-else-if="showCleanSuccess" class="animate-temporary-show inline-flex items-center justify-center gap-x-2"
          @animationend="showCleanSuccess = false">
          <Check />
          <span>{{ t('Cleaned successfully', { count: lastCleanTotal }) }}</span>
        </p>
        <span v-else>{{ t('Clean now') }}</span>
      </Button>
    </div>
  </main>
</template>

<style scoped>
.animate-temporary-show {
  animation: animate-temporary-show 2s;
}

@keyframes animate-temporary-show {
  from {
    opacity: 0;
  }

  25% {
    opacity: 1;
  }

  75% {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}
</style>
