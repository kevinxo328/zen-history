import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { cleanHistory } from '@/lib/history';
import { KeepRecentValue, RemoveRecentValue, TimeRangeType } from '@/types/clean-settings';

import { browserMock } from './setup';

describe('cleanHistory', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-12T12:00:00.000Z'));

    // reset mocks
    browserMock.history.search.mockReset();
    browserMock.history.deleteRange.mockReset();
    browserMock.history.deleteUrl.mockReset();

    // mock search to return empty array by default
    browserMock.history.search.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calculates time correctly for REMOVE_RECENT: Past 1 Hour', async () => {
    await cleanHistory({
      type: TimeRangeType.REMOVE_RECENT,
      value: RemoveRecentValue.PAST_ONE_HOUR
    });

    // expect search to be called with correct startTime (1 hour ago)
    const oneHourAgo = new Date('2026-03-12T11:00:00.000Z').getTime();
    expect(browserMock.history.search).toHaveBeenCalledWith(
      expect.objectContaining({
        startTime: oneHourAgo
      })
    );
  });

  it('calculates time correctly for KEEP_RECENT: 1 Week', async () => {
    await cleanHistory({ type: TimeRangeType.KEEP_RECENT, value: KeepRecentValue.ONE_WEEK });

    // expect search to be called with correct endTime (1 week ago)
    const now = new Date('2026-03-12T12:00:00.000Z').getTime();
    const oneWeekAgo = now - 7 * 24 * 3600 * 1000;

    expect(browserMock.history.search).toHaveBeenCalledWith(
      expect.objectContaining({
        startTime: 0,
        endTime: oneWeekAgo
      })
    );
  });

  it('calls deleteRange with correct startTime and endTime instead of deleteUrl', async () => {
    browserMock.history.search.mockResolvedValue([{ url: 'https://example.com' }]);

    await cleanHistory({
      type: TimeRangeType.REMOVE_RECENT,
      value: RemoveRecentValue.PAST_ONE_HOUR
    });

    const oneHourAgo = new Date('2026-03-12T11:00:00.000Z').getTime();

    expect(browserMock.history.deleteRange).toHaveBeenCalledWith({
      startTime: oneHourAgo,
      endTime: new Date('2026-03-12T12:00:00.000Z').getTime()
    });
    expect(browserMock.history.deleteUrl).not.toHaveBeenCalled();
  });

  it('skips deleteRange if search returns no results', async () => {
    browserMock.history.search.mockResolvedValue([]);

    const result = await cleanHistory({
      type: TimeRangeType.REMOVE_RECENT,
      value: RemoveRecentValue.PAST_ONE_HOUR
    });

    expect(browserMock.history.deleteRange).not.toHaveBeenCalled();
    expect(result.total).toBe(0);
  });
});
