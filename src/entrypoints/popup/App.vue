<script lang="ts" setup>
import Button from "@/components/ui/button/Button.vue";
import {Label} from "@/components/ui/label";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {useCleanSettingStore} from "@@/stores/clean-setting-store";
import {AlarmsName, CleanMessage} from "@/types/background";
import {
  KeepRecentValue,
  RemoveRecentValue,
  TimeRange,
  TimeRangeType,
} from "@/types/clean-settings";
import {LoaderCircle, Zap, Clock, Moon, Sun, Check} from "lucide-vue-next";
import {Switch} from "@/components/ui/switch";
import {formatRelativeTime, getNextMidnightTimestamp} from "@/lib/utils";
import {Card, CardContent} from "@/components/ui/card";
import {useUserPreferenceStore} from "@@/stores/user-perference-store";

const VERSION = import.meta.env.PACKAGE_VERSION;

const cleanSettingStore = useCleanSettingStore();
const userPerferenceStore = useUserPreferenceStore();
const isCleaning = ref(false);
const showCleanSuccess = ref(false);

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
    await browser.runtime.sendMessage(new CleanMessage(timeRange));
  } catch (error) {
    console.error("Error during cleaning:", error);
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

const toggleAutoCleanAlarm = () => {
  if (cleanSettingStore.autoClean.enabled) {
    browser.alarms.create(AlarmsName.AUTO_CLEAN, {
      when: getNextMidnightTimestamp(new Date()),
      periodInMinutes: 24 * 60, // Repeat every 24 hours
      // delayInMinutes: 0.5, // Testing purposes, uncomment to test
    });
  } else {
    browser.alarms.clear(AlarmsName.AUTO_CLEAN);
  }
};

onBeforeMount(() => {
  // Restore settings from storage when the component is mounted
  cleanSettingStore.$restoreFromStorage();
  userPerferenceStore.$restoreFromStorage();
});
</script>

<template>
  <main class="container min-w-[350px] p-4 flex flex-col gap-y-4">
    <header class="flex justify-between items-center">
      <div class="flex items-center gap-x-2">
        <img src="@/assets/Logo.svg" class="size-8" alt="logo" />
        <div>
          <h1 class="font-bold text-sm">History Manager</h1>
          <span class="text-foreground/60"> v{{ VERSION }} </span>
        </div>
      </div>
      <Button
        @click="userPerferenceStore.toggleTheme"
        variant="outline"
        size="icon"
      >
        <Moon v-if="userPerferenceStore.isDarkTheme" class="size-4" />
        <Sun v-else class="size-4" />
      </Button>
    </header>
    <hr />
    <Card>
      <CardContent>
        <div class="flex items-center gap-x-2 mb-2">
          <Clock class="size-4" />
          <h3 class="font-bold text-sm">Clean Time Range</h3>
        </div>
        <RadioGroup
          v-model="cleanSettingStore.timeRange.type"
          @update:model-value="setDefaultTimeRangeValue"
          class="mb-2"
        >
          <div
            v-for="key in [
              TimeRangeType.KEEP_RECENT,
              TimeRangeType.REMOVE_RECENT,
            ]"
            :key="key"
            class="flex items-center space-x-2"
          >
            <RadioGroupItem :id="`option-${key}`" :value="key" />
            <Label :for="`option-${key}`" class="cursor-pointer text-xs">
              {{
                key === TimeRangeType.KEEP_RECENT
                  ? "Keep recent data and delete older"
                  : "Delete data within specified time range"
              }}
            </Label>
          </div>
        </RadioGroup>
        <Label class="cursor-pointer text-xs mb-1">
          {{
            cleanSettingStore.timeRange.type === TimeRangeType.KEEP_RECENT
              ? "Select how long to keep recent data"
              : "Select time range to remove recent data"
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
              <SelectItem
                v-for="option in Object.values(KeepRecentValue)"
                :key="option"
                :value="option"
              >
                {{ option }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          v-else-if="
            cleanSettingStore.timeRange.type === TimeRangeType.REMOVE_RECENT
          "
          v-model="cleanSettingStore.timeRange.value"
        >
          <SelectTrigger class="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem
                v-for="option in Object.values(RemoveRecentValue)"
                :key="option"
                :value="option"
              >
                {{ option }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
    <Card>
      <CardContent>
        <div class="flex justify-between items-center mb-2">
          <div class="flex items-center gap-x-2">
            <Zap class="size-4" />
            <h3 class="font-bold text-sm">Auto Clean Schedule</h3>
          </div>
          <Switch
            v-model="cleanSettingStore.autoClean.enabled"
            @update:model-value="toggleAutoCleanAlarm"
          />
        </div>
        <p>Will execute auto clean tomorrow at 12:00 AM</p>
        <hr class="my-4" />
        <div class="flex justify-between items-center">
          <span class="text-foreground/70">Last executed</span>
          <span
            v-if="cleanSettingStore.analytics.lastAutoCleanTimestamp"
            class="font-bold"
          >
            {{
              formatRelativeTime(
                cleanSettingStore.analytics.lastAutoCleanTimestamp
              )
            }}
          </span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-foreground/70">Total cleaned</span>
          <span
            v-if="cleanSettingStore.analytics.lastAutoCleanTimestamp"
            class="font-bold"
          >
            {{ cleanSettingStore.analytics.lastAutoCleanTotal }}
          </span>
        </div>
      </CardContent>
    </Card>
    <div class="flex flex-col gap-y-2">
      <Button
        @click="
          handleClean(
            cleanSettingStore.timeRange.type === TimeRangeType.KEEP_RECENT
              ? {
                  type: TimeRangeType.KEEP_RECENT,
                  value: cleanSettingStore.timeRange.value,
                }
              : {
                  type: TimeRangeType.REMOVE_RECENT,
                  value: cleanSettingStore.timeRange.value,
                }
          )
        "
        :disabled="isCleaning || showCleanSuccess"
        :class="[
          isCleaning ? 'w-10' : 'w-full',
          showCleanSuccess ? 'opacity-100!' : '',
        ]"
        @transitionend="showCleanSuccess = true"
        class="rounded-full m-auto transition-[width] duration-500 ease-out"
      >
        <LoaderCircle v-if="isCleaning" class="animate-spin" />
        <p
          v-else-if="showCleanSuccess"
          @animationend="showCleanSuccess = false"
          class="inline-flex items-center justify-center gap-x-2 animate-temporary-show"
        >
          <Check />
          <span>Cleaned successfully</span>
        </p>
        <span v-else>Clean now</span>
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
