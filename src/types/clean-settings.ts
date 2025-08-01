export enum TimeRangeType {
  REMOVE_RECENT = "removeRecent", // Remove recent items
  KEEP_RECENT = "keepRecent", // Keep recent items and remove older ones
}

export enum KeepRecentValue {
  ONE_DAY = "1 Day",
  ONE_WEEK = "1 Week",
  TWO_WEEKS = "2 Weeks",
  ONE_MONTH = "1 Month",
  THREE_MONTHS = "3 Months",
}

export enum RemoveRecentValue {
  PAST_ONE_HOUR = "Past 1 Hour",
  PAST_ONE_DAY = "Past 1 Day",
  PAST_ONE_WEEK = "Past 1 Week",
  PAST_ONE_MONTH = "Past 1 Month",
  PAST_THREE_MONTH = "Past 3 Months",
  ALL_TIME = "All Time",
}

export type TimeRange =
  | {
      type: TimeRangeType.KEEP_RECENT;
      value: KeepRecentValue;
    }
  | {
      type: TimeRangeType.REMOVE_RECENT;
      value: RemoveRecentValue;
    };
