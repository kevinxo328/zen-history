<script lang="ts" setup>
import { Check, Clock, LoaderCircle, Settings, Zap } from 'lucide-vue-next';
import { computed, onBeforeMount, ref, toRaw } from 'vue';

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
import useLocaleSync from '@/composibles/useLocaleSync';
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
const lastCleanTotalCapped = ref(false);

const amPm = computed({
  get: () => (cleanSettingStore.autoClean.hour >= 12 ? 'PM' : 'AM'),
  set: (val) => {
    let h = cleanSettingStore.autoClean.hour % 12;
    if (val === 'PM') h += 12;
    cleanSettingStore.autoClean.hour = h;
    toggleAutoCleanAlarm(
      cleanSettingStore.autoClean.enabled,
      cleanSettingStore.autoClean.hour,
      cleanSettingStore.autoClean.minute
    );
  }
});

const hour12 = computed({
  get: () => {
    const h = cleanSettingStore.autoClean.hour % 12;
    return (h === 0 ? 12 : h).toString();
  },
  set: (val) => {
    const h12 = parseInt(val);
    let h = h12 % 12;
    if (amPm.value === 'PM') h += 12;
    cleanSettingStore.autoClean.hour = h;
    toggleAutoCleanAlarm(
      cleanSettingStore.autoClean.enabled,
      cleanSettingStore.autoClean.hour,
      cleanSettingStore.autoClean.minute
    );
  }
});

const minute = computed({
  get: () => cleanSettingStore.autoClean.minute.toString().padStart(2, '0'),
  set: (val) => {
    cleanSettingStore.autoClean.minute = parseInt(val);
    toggleAutoCleanAlarm(
      cleanSettingStore.autoClean.enabled,
      cleanSettingStore.autoClean.hour,
      cleanSettingStore.autoClean.minute
    );
  }
});

const handleToggleAutoClean = (enabled: boolean) => {
  toggleAutoCleanAlarm(
    enabled,
    cleanSettingStore.autoClean.hour,
    cleanSettingStore.autoClean.minute
  );
};

useLocaleSync(() => userPerferenceStore.locale);

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
      lastCleanTotalCapped.value = Boolean(response.isCountCapped);
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

const autoCleanTotalLabel = computed(() => {
  const total = Intl.NumberFormat().format(cleanSettingStore.analytics.lastAutoCleanTotal);
  return cleanSettingStore.analytics.lastAutoCleanTotalCapped ? `${total}+` : total;
});

const manualCleanTotalLabel = computed(() => {
  const total = Intl.NumberFormat().format(lastCleanTotal.value);
  return lastCleanTotalCapped.value ? `${total}+` : total;
});

const openOptionsPage = () => {
  browser.runtime.openOptionsPage();
};

onBeforeMount(async () => {
  // userPreferenceStore is already restored in popup/main.ts before mount
  await cleanSettingStore.$restoreFromStorage();
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
          :key="`select-keep-${userPerferenceStore.locale}`"
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
          :key="`select-remove-${userPerferenceStore.locale}`"
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
            <h3 class="text-sm font-bold">{{ t('Daily Auto Clean') }}</h3>
          </div>
          <Switch
            v-model="cleanSettingStore.autoClean.enabled"
            @update:model-value="handleToggleAutoClean"
          />
        </div>
        <div v-if="cleanSettingStore.autoClean.enabled">
          <div class="mb-3 flex items-center gap-x-2">
            <Select v-model="amPm">
              <SelectTrigger class="h-8 w-20 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>

            <Select v-model="hour12">
              <SelectTrigger class="h-8 w-16 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="h in Array.from({ length: 12 }, (_, i) => (i + 1).toString())"
                  :key="h"
                  :value="h"
                >
                  {{ h.padStart(2, '0') }}
                </SelectItem>
              </SelectContent>
            </Select>

            <span class="text-xs font-bold">:</span>

            <Select v-model="minute">
              <SelectTrigger class="h-8 w-16 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="00">00</SelectItem>
                <SelectItem value="30">30</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <p v-else class="text-xs text-foreground/70">
          {{ t('Auto clean is disabled') }}
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
              ~{{ autoCleanTotalLabel }}
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
          <span>{{ t('Cleaned successfully', { count: manualCleanTotalLabel }) }}</span>
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
