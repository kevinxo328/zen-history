import {
  KeepRecentValue,
  RemoveRecentValue,
  TimeRange,
  TimeRangeType
} from '@/types/clean-settings';

export async function cleanHistory(
  timeRange: TimeRange
): Promise<{ total: number; duration: number }> {
  const MAX_RESULTS = 10000; // Large number to get an approximate count
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

  // 1. Search to get an approximate count of items to be deleted
  const searchResults = await browser.history.search({
    text: '',
    maxResults: MAX_RESULTS,
    ...(startTime !== null ? { startTime } : {}),
    ...(endTime !== null ? { endTime } : {})
  });

  const total = searchResults ? searchResults.length : 0;

  // 2. Delete the range using native API if there are items to delete
  if (total > 0) {
    await browser.history.deleteRange({
      startTime: startTime !== null ? startTime : 0,
      endTime: endTime !== null ? endTime : Date.now()
    });
  }

  const duration = Math.round(performance.now() - perfStart);

  return {
    total,
    duration
  };
}
