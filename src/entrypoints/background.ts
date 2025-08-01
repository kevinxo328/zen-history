import {AlarmsName, CleanMessage} from "@/types/background";
import {
  KeepRecentValue,
  RemoveRecentValue,
  TimeRangeType,
  TimeRange,
} from "@/types/clean-settings";
import {useCleanSettingStore} from "@@/stores/clean-setting-store";

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message.action === CleanMessage.action) {
      const cleanMessage = message as CleanMessage;
      const timeRange = cleanMessage.timeRange;

      cleanHistory(timeRange)
        .then(({total, duration}) => {
          console.log(
            `Successfully deleted ${total} history items in ${duration}ms`
          );
          sendResponse({success: true, total, duration});
        })
        .catch((error) => {
          console.error(`Failed to clear history: ${error.message || error}`);
          sendResponse({success: false, error: error.message || error});
        });

      return true; // Indicates that the response will be sent asynchronously
    }
  });

  browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === AlarmsName.AUTO_CLEAN) {
      const key = `local:${useCleanSettingStore.$id}` as const;

      storage.getItem<any>(key).then((savedState) => {
        console.log("Restoring state from storage:", savedState);
        if (
          !savedState ||
          Object.getPrototypeOf(savedState) !== Object.prototype
        ) {
          console.warn("No valid state found in storage, skipping restore.");
          return;
        }

        const saveType = savedState?.timeRange?.type;
        const saveValue = savedState?.timeRange?.value;

        if (!saveType || !saveValue) {
          console.warn("Invalid time range type or value, skipping cleanup.");
          return;
        }
        const timeRange: TimeRange = {
          type: saveType,
          value: saveValue,
        };

        cleanHistory(timeRange)
          .then(({total, duration}) => {
            console.log(
              `Successfully deleted ${total} history items in ${duration}ms`
            );
            storage.setItem(
              key,
              {
                ...savedState,
                analytics: {
                  ...savedState.analytics,
                  lastAutoCleanTimestamp: Date.now(),
                  lastAutoCleanTotal: total,
                  lastAutoCleanDuration: duration,
                },
              } as any // Update the state with the last auto-clean timestamp
            );
          })
          .catch((error) => {
            console.error(`Failed to clear history: ${error.message || error}`);
          });
      });
    }
  });
});

function cleanHistory(timeRange: TimeRange) {
  const MAX_RESULTS = 1000; // Adjust as needed
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
    startTime = now - 365 * 24 * 3600 * 1000; // Default to 1 year ago to prevent task from running indefinitely.
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

  let totalDeleted = 0;

  function promiseProcess(
    resolve: (result: {total: number; duration: number}) => void,
    reject: (error: any) => void
  ) {
    browser.history
      .search({
        text: "",
        maxResults: MAX_RESULTS,
        ...(startTime !== null ? {startTime} : {}),
        ...(endTime !== null ? {endTime} : {}),
      })
      .then((searchResults) => {
        if (!searchResults || searchResults.length === 0) {
          resolve({
            total: totalDeleted,
            duration: performance.now() - perfStart,
          });
        }

        const filteredResults = searchResults.filter(
          (result) => typeof result.url === "string"
        );

        const deletePromises = filteredResults.map((result) => {
          return browser.history.deleteUrl({url: result.url!});
        });

        return Promise.allSettled(deletePromises).then((results) => {
          totalDeleted += results.filter(
            (result) => result.status === "fulfilled"
          ).length;

          return searchResults.length;
        });
      })
      .then((searchCount) => {
        // If we have fewer results than MAX_RESULTS, we are done
        if (searchCount < MAX_RESULTS) {
          resolve({
            total: totalDeleted,
            duration: performance.now() - perfStart,
          });
        } else {
          // Otherwise, process the next batch after a short delay
          setTimeout(() => promiseProcess(resolve, reject), 10);
        }
      })
      .catch(reject);
  }

  return new Promise(promiseProcess);
}
