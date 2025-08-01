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
import {CleanMessage} from "@/types/background";
import {
  KeepRecentValue,
  RemoveRecentValue,
  TimeRange,
  TimeRangeType,
} from "@/types/clean-settings";
import {LoaderCircle, Zap, Clock} from "lucide-vue-next";
import {Switch} from "@/components/ui/switch";

const cleanSettingStore = useCleanSettingStore();
const isCleaning = ref(false);
const response = ref("");

const setDefaultTimeRangeValue = () => {
  if (cleanSettingStore.timeRange.type === TimeRangeType.KEEP_RECENT) {
    cleanSettingStore.timeRange.value = KeepRecentValue.ONE_MONTH;
  } else {
    cleanSettingStore.timeRange.value = RemoveRecentValue.PAST_ONE_MONTH;
  }
};

const handleClean = async (timeRange: TimeRange) => {
  isCleaning.value = true;
  try {
    const res = await browser.runtime.sendMessage(new CleanMessage(timeRange));
    response.value = res;
  } catch (error) {
    console.error("Error during cleaning:", error);
    response.value = "An error occurred while cleaning.";
  } finally {
    isCleaning.value = false;
  }
};

onBeforeMount(() => {
  // Restore settings from storage when the component is mounted
  cleanSettingStore.$restoreFromStorage();
});
</script>

<template>
  <main class="container min-w-[400px] p-4 flex flex-col gap-y-4">
    <header>
      <h1 class="font-bold text-lg">History Manager</h1>
      {{ response }}
    </header>
    <hr />
    <div class="border rounded-md p-4">
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
    </div>
    <div class="border rounded-md p-4 bg-accent border-accent-foreground">
      <div class="flex justify-between items-center mb-2">
        <div class="flex items-center gap-x-2">
          <Zap class="size-4" />
          <h3 class="font-bold text-sm">Auto Clean Schedule</h3>
        </div>
        <Switch v-model="cleanSettingStore.autoClean.enabled" />
      </div>
      <p>Will execute auto clean tomorrow at 12:00 AM</p>
    </div>
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
        :disabled="isCleaning"
        size="sm"
        class="w-full"
      >
        <LoaderCircle v-if="isCleaning" class="animate-spin" />
        {{ isCleaning ? "Cleaning..." : "Clean now" }}
      </Button>
    </div>
  </main>
</template>
