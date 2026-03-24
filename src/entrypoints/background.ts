import { cleanHistory } from '@/lib/history';
import { toggleAutoCleanAlarm } from '@/lib/wxt';
import { AlarmsName, CleanMessage } from '@/types/background';
import { TimeRange } from '@/types/clean-settings';
import { CleanSettingState, useCleanSettingStore } from '@@/stores/clean-setting-store';

export default defineBackground(() => {
  // Ensure that alarms are initialized
  browser.alarms.get(AlarmsName.AUTO_CLEAN).then((alarm) => {
    if (alarm)
      return console.log(
        'Auto clean alarm is set for:',
        new Date(alarm.scheduledTime).toLocaleString()
      );

    console.log('No auto clean alarm is currently set.');

    // If no alarm is set, we can initialize it based on the current settings
    storage
      .getItem<CleanSettingState>(`local:${useCleanSettingStore.$id}` as const)
      .then((savedState) => {
        if (!savedState || Object.getPrototypeOf(savedState) !== Object.prototype) {
          console.warn('No valid state found in storage, skipping restore.');
          return;
        }

        const enabled = savedState.autoClean?.enabled ?? false;
        toggleAutoCleanAlarm(enabled);
        if (enabled) {
          browser.alarms.get(AlarmsName.AUTO_CLEAN).then((alarm) => {
            if (!alarm) return;
            console.log(
              'Auto clean alarm initialized for:',
              new Date(alarm.scheduledTime).toLocaleString()
            );
          });
        } else {
          console.log('Auto clean alarm is disabled, no action taken.');
        }
      });
  });

  browser.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message.action === CleanMessage.action) {
      const cleanMessage = message as CleanMessage;
      const timeRange = cleanMessage.timeRange;

      cleanHistory(timeRange)
        .then(({ total, duration }) => {
          console.log(`Successfully deleted ~${total} history items in ${duration}ms`);
          sendResponse({ success: true, total, duration });
        })
        .catch((error) => {
          console.error(`Failed to clear history: ${error.message || error}`);
          sendResponse({ success: false, error: error.message || error });
        });

      return true; // Indicates that the response will be sent asynchronously
    }
  });

  browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === AlarmsName.AUTO_CLEAN) {
      const key = `local:${useCleanSettingStore.$id}` as const;

      storage.getItem<CleanSettingState>(key).then((savedState) => {
        console.log('Restoring state from storage:', savedState);
        if (!savedState || Object.getPrototypeOf(savedState) !== Object.prototype) {
          console.warn('No valid state found in storage, skipping restore.');
          return;
        }

        const saveType = savedState?.timeRange?.type;
        const saveValue = savedState?.timeRange?.value;

        if (!saveType || !saveValue) {
          console.warn('Invalid time range type or value, skipping cleanup.');
          return;
        }
        const timeRange: TimeRange = {
          type: saveType,
          value: saveValue
        } as TimeRange;

        cleanHistory(timeRange)
          .then(({ total, duration }) => {
            console.log(`Successfully deleted ~${total} history items in ${duration}ms`);
            storage.setItem(key, {
              ...savedState,
              analytics: {
                ...savedState.analytics,
                lastAutoCleanTimestamp: Date.now(),
                lastAutoCleanTotal: total,
                lastAutoCleanDuration: duration
              }
            });
          })
          .catch((error) => {
            console.error(`Failed to clear history: ${error.message || error}`);
          });
      });
    }
  });
});
