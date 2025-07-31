<script lang="ts" setup>
import {ref} from "vue";
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
import {LoaderCircle} from "lucide-vue-next";

const cleanSettingStore = useCleanSettingStore();

const timeRangeType = ref<TimeRangeType>(cleanSettingStore.timeRange.type);
const keepRecentValue = ref(KeepRecentValue.OneMonth);
const removeRecentValue = ref(RemoveRecentValue.Past1Month);
const isCleaning = ref(false);
const response = ref("");

const handleSaveSettings = () => {
  cleanSettingStore.timeRange.type = timeRangeType.value;
  if (timeRangeType.value === TimeRangeType.KEEP_RECENT) {
    cleanSettingStore.timeRange.value = keepRecentValue.value;
  } else if (timeRangeType.value === TimeRangeType.REMOVE_RECENT) {
    cleanSettingStore.timeRange.value = removeRecentValue.value;
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
</script>

<template>
  <main class="container min-w-[400px] p-4 flex flex-col gap-y-4">
    <header>
      <h1 class="font-bold text-lg">History Manager</h1>
      {{ response }}
    </header>
    <hr />
    <!-- <div class="border rounded-md p-4">
      <h3 class="font-bold">Clean Items</h3>
    </div> -->
    <div class="border rounded-md p-4">
      <h3 class="font-bold text-sm mb-2">Clean Time Range</h3>
      <RadioGroup v-model="timeRangeType" class="mb-2">
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
          timeRangeType === TimeRangeType.KEEP_RECENT
            ? "Select how long to keep recent data"
            : "Select time range to remove recent data"
        }}
      </Label>
      <Select
        v-if="timeRangeType === TimeRangeType.KEEP_RECENT"
        v-model="keepRecentValue"
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
        v-else-if="timeRangeType === TimeRangeType.REMOVE_RECENT"
        v-model="removeRecentValue"
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
    <!-- <div class="border rounded-md p-4">
      <h3 class="font-bold text-sm mb-2">Auto Clean Schedule</h3>
    </div> -->
    <div class="flex flex-col gap-y-2">
      <Button
        @click="
          handleClean(
            timeRangeType === TimeRangeType.KEEP_RECENT
              ? {
                  type: TimeRangeType.KEEP_RECENT,
                  value: keepRecentValue,
                }
              : {
                  type: TimeRangeType.REMOVE_RECENT,
                  value: removeRecentValue,
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
      <Button
        @click="handleSaveSettings"
        size="sm"
        variant="outline"
        class="w-full"
      >
        Save Settings
      </Button>
    </div>
  </main>
</template>
