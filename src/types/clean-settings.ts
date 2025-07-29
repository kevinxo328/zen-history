export enum TimeRangeType {
  REMOVE_RECENT = "removeRecent", // Remove recent items
  KEEP_RECENT = "keepRecent", // Keep recent items and remove older ones
}

export enum KeepRecentValue {
  OneDay = "1 Day",
  OneWeek = "1 Week",
  TwoWeeks = "2 Weeks",
  OneMonth = "1 Month",
  ThreeMonths = "3 Months",
}

export enum RemoveRecentValue {
  Past1Hour = "Past 1 Hour",
  Past1Day = "Past 1 Day",
  Past1Week = "Past 1 Week",
  Past1Month = "Past 1 Month",
  Past3Months = "Past 3 Months",
  AllTime = "All Time",
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
