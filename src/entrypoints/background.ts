import {CleanMessage} from "@/types/background";
import {
  KeepRecentValue,
  RemoveRecentValue,
  TimeRangeType,
} from "@/types/clean-settings";
import {Browser} from "wxt/browser";

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message.action === CleanMessage.action) {
      const cleanMessage = message as CleanMessage;
      const now = new Date().getTime();

      if (cleanMessage.timeRange.type === TimeRangeType.REMOVE_RECENT) {
        removeRecentHistory(cleanMessage.timeRange.value)
          .then(() => {
            sendResponse({
              status: "success",
              message: "History cleaned successfully",
            });
          })
          .catch((error) => {
            sendResponse({
              status: "error",
              message: `Failed to clean history: ${error}`,
            });
          });
      } else if (cleanMessage.timeRange.type === TimeRangeType.KEEP_RECENT) {
        // TODO: This action can take a long time. It should be optimized.
        keepRecentHistory(cleanMessage.timeRange.value)
          .then((total) => {
            sendResponse({
              status: "success",
              message: `Successfully deleted ${total} history items`,
              deletedCount: total,
            });
          })
          .catch((error) => {
            console.error("History cleanup failed:", error);
            sendResponse({
              status: "error",
              message: `Failed to clear history: ${error.message || error}`,
            });
          });
      } else {
        sendResponse({
          status: "error",
          message: "Invalid time range type",
        });
      }
      return true; // Indicates that the response will be sent asynchronously
    }
  });
});

function removeRecentHistory(value: RemoveRecentValue) {
  const now = new Date().getTime();
  const removalOptions: Browser.browsingData.RemovalOptions = {
    since: 0, // Default to 0 to remove all history
  };

  switch (value) {
    case RemoveRecentValue.Past1Hour:
      removalOptions.since = now - 3600 * 1000; // 1 hour
      break;
    case RemoveRecentValue.Past1Day:
      removalOptions.since = now - 24 * 3600 * 1000; // 1 day
      break;
    case RemoveRecentValue.Past1Week:
      removalOptions.since = now - 7 * 24 * 3600 * 1000; // 1 week
      break;
    case RemoveRecentValue.Past1Month:
      removalOptions.since = now - 30 * 24 * 3600 * 1000; // 1 month
      break;
    case RemoveRecentValue.Past3Months:
      removalOptions.since = now - 90 * 24 * 3600 * 1000; // 3 months
      break;
  }

  return browser.browsingData.removeHistory(removalOptions);
}

function keepRecentHistory(value: KeepRecentValue) {
  const maxResults = 1000; // Adjust as needed
  const now = new Date().getTime();
  const startTime = now - 365 * 24 * 3600 * 1000; // Default to 1 year ago to prevent task from running indefinitely.
  let endTime = now;

  switch (value) {
    case KeepRecentValue.OneDay:
      endTime = now - 24 * 3600 * 1000; // 1 day
      break;
    case KeepRecentValue.OneWeek:
      endTime = now - 7 * 24 * 3600 * 1000; // 1 week
      break;
    case KeepRecentValue.TwoWeeks:
      endTime = now - 14 * 24 * 3600 * 1000; // 2 weeks
      break;
    case KeepRecentValue.OneMonth:
      endTime = now - 30 * 24 * 3600 * 1000; // 1 month
      break;
    case KeepRecentValue.ThreeMonths:
      endTime = now - 90 * 24 * 3600 * 1000; // 3 months
      break;
  }

  let totalDeleted = 0;

  function promiseProcess(
    resolve: (total: number) => void,
    reject: (error: any) => void
  ) {
    browser.history
      .search({
        text: "",
        startTime,
        endTime,
        maxResults,
      })
      .then((searchResults) => {
        if (!searchResults || searchResults.length === 0) {
          resolve(totalDeleted);
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
        // If we have fewer results than maxResults, we are done
        if (searchCount < maxResults) {
          resolve(totalDeleted);
        } else {
          // Otherwise, process the next batch after a short delay
          setTimeout(() => promiseProcess(resolve, reject), 10);
        }
      })
      .catch(reject);
  }

  return new Promise(promiseProcess);
}
