import { defineStore } from 'pinia';

import { BrowsingDataTypes,KeepRecentValue, TimeRange, TimeRangeType } from '@/types/clean-settings';

export interface CleanSettingState {
  timeRange: TimeRange;
  browsingDataTypes: BrowsingDataTypes;
  autoClean: {
    enabled: boolean;
  };
  analytics: {
    lastAutoCleanTimestamp: number;
    lastAutoCleanTotal: number;
    lastAutoCleanDuration: number;
  };
}

export const useCleanSettingStore = defineStore('cleanSetting', {
  state: (): CleanSettingState => ({
    timeRange: {
      type: TimeRangeType.KEEP_RECENT,
      value: KeepRecentValue.ONE_MONTH
    },
    browsingDataTypes: {
      cookies: false,
      cache: false,
      downloads: false,
      formData: false
    },
    autoClean: {
      enabled: false
    },
    analytics: {
      lastAutoCleanTimestamp: 0,
      lastAutoCleanTotal: 0,
      lastAutoCleanDuration: 0
    }
  })
});
