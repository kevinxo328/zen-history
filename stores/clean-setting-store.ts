// stores/counter.js
import {defineStore} from "pinia";
import {
  TimeRange,
  TimeRangeType,
  KeepRecentValue,
} from "@/types/clean-settings";

export const useCleanSettingStore = defineStore("cleanSetting", {
  state: () => ({
    timeRange: {
      type: TimeRangeType.KEEP_RECENT,
      value: KeepRecentValue.OneMonth,
    } as TimeRange,
    autoClean: {
      enabled: false,
    },
  }),
});
