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
      value: KeepRecentValue.ONE_MONTH,
    } as TimeRange,
    autoClean: {
      enabled: false,
    },
    analytics: {
      lastAutoCleanTimestamp: 0,
      lastAutoCleanTotal: 0,
      lastAutoCleanDuration: 0,
    },
  }),
});
