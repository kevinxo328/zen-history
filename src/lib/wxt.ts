import { AlarmsName } from '@/types/background';

import { getNextScheduledTimestamp } from './utils';

export const toggleAutoCleanAlarm = async (enabled: boolean, hour: number = 0, minute: number = 0) => {
  if (enabled) {
    browser.alarms.create(AlarmsName.AUTO_CLEAN, {
      when: getNextScheduledTimestamp(new Date(), hour, minute)
      // Remove periodInMinutes to avoid DST drift.
      // We will reschedule the next alarm manually after each execution.
    });
  } else {
    browser.alarms.clear(AlarmsName.AUTO_CLEAN);
  }
};
