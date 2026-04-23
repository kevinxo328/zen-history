import {
  BrowsingDataTypes,
  KeepRecentValue,
  RemoveRecentValue,
  TimeRange,
  TimeRangeType
} from '@/types/clean-settings';

export interface CleanHistoryOptions {
  needEstimate?: boolean;
  countCap?: number;
}

export async function cleanHistory(
  timeRange: TimeRange,
  dataTypes?: BrowsingDataTypes,
  options: CleanHistoryOptions = {}
): Promise<{ total: number; duration: number; isCountCapped: boolean }> {
  const { needEstimate = true, countCap = 10000 } = options;
  const now = new Date().getTime();
  const perfStart = performance.now();

  let startTime: number | null = null;
  let endTime: number | null = null;

  if (timeRange.type === TimeRangeType.REMOVE_RECENT) {
    endTime = null; // We want to remove all history up to now
    switch (timeRange.value) {
      case RemoveRecentValue.PAST_ONE_HOUR:
        startTime = now - 3600 * 1000; // 1 hour
        break;
      case RemoveRecentValue.PAST_ONE_DAY:
        startTime = now - 24 * 3600 * 1000; // 1 day
        break;
      case RemoveRecentValue.PAST_ONE_WEEK:
        startTime = now - 7 * 24 * 3600 * 1000; // 1 week
        break;
      case RemoveRecentValue.PAST_ONE_MONTH:
        startTime = now - 30 * 24 * 3600 * 1000; // 1 month
        break;
      case RemoveRecentValue.PAST_THREE_MONTH:
        startTime = now - 90 * 24 * 3600 * 1000; // 3 months
        break;
    }
  } else {
    startTime = 0; // Epoch time, meaning "from the beginning of history"
    switch (timeRange.value) {
      case KeepRecentValue.ONE_DAY:
        endTime = now - 24 * 3600 * 1000; // 1 day
        break;
      case KeepRecentValue.ONE_WEEK:
        endTime = now - 7 * 24 * 3600 * 1000; // 1 week
        break;
      case KeepRecentValue.TWO_WEEKS:
        endTime = now - 14 * 24 * 3600 * 1000; // 2 weeks
        break;
      case KeepRecentValue.ONE_MONTH:
        endTime = now - 30 * 24 * 3600 * 1000; // 1 month
        break;
      case KeepRecentValue.THREE_MONTHS:
        endTime = now - 90 * 24 * 3600 * 1000; // 3 months
        break;
    }
  }

  let total = 0;
  let isCountCapped = false;

  // 1. Search to get an approximate count only when needed.
  if (needEstimate) {
    const searchResults = await browser.history.search({
      text: '',
      maxResults: countCap,
      ...(startTime !== null ? { startTime } : {}),
      ...(endTime !== null ? { endTime } : {})
    });
    total = searchResults ? searchResults.length : 0;
    isCountCapped = total >= countCap;
  }

  // 2. Delete the range using native API.
  if (!needEstimate || total > 0) {
    await browser.history.deleteRange({
      startTime: startTime !== null ? startTime : 0,
      endTime: endTime !== null ? endTime : Date.now()
    });
  }

  // 3. Clear browsing data if selected
  if (dataTypes && Object.values(dataTypes).some((v) => v)) {
    /**
     * API Limitation Notice:
     * chrome.browsingData.remove only supports 'since' (start time), not 'until' (end time).
     * - In REMOVE_RECENT mode: We use 'since: startTime', which works correctly.
     * - In KEEP_RECENT mode: We would need 'until: endTime', which is NOT supported.
     * To prevent accidental loss of recent data (like cookies) that the user wants to KEEP,
     * we skip browsing data cleanup in KEEP_RECENT mode.
     */
    if (timeRange.type === TimeRangeType.REMOVE_RECENT) {
      await browser.browsingData.remove(
        { since: startTime !== null ? startTime : 0 },
        {
          cookies: dataTypes.cookies,
          cache: dataTypes.cache,
          downloads: dataTypes.downloads,
          formData: dataTypes.formData
        }
      );
    }
  }

  const duration = Math.round(performance.now() - perfStart);

  return {
    total,
    duration,
    isCountCapped
  };
}
