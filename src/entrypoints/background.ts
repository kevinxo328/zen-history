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

      // Implement the logic to clean history here
      if (cleanMessage.timeRange.type === TimeRangeType.REMOVE_RECENT) {
        const removalOptions: Browser.browsingData.RemovalOptions = {
          since: 0, // Default to 0 to remove all history
        };

        switch (cleanMessage.timeRange.value) {
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

        browser.browsingData
          .removeHistory(removalOptions)
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
        // Implement the logic to keep recent history here
        const startTime = now - 365 * 24 * 3600 * 1000; // Default to 1 year ago.
        let endTime = now;
        const maxResults = 1000; // Adjust as needed

        switch (cleanMessage.timeRange.value) {
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

        function clearHistoryExceptRecent(
          startTime: number,
          endTime: number,
          maxResults: number,
          sendResponse: (response: any) => void
        ) {
          let totalDeleted = 0;

          function processHistoryBatch() {
            return browser.history
              .search({
                text: "",
                startTime,
                endTime,
                maxResults,
              })
              .then((searchResults) => {
                if (!searchResults || searchResults.length === 0) {
                  console.log(
                    "No history items to delete",
                    searchResults,
                    endTime,
                    maxResults
                  );
                  return Promise.resolve("completed");
                }

                const deletePromises = searchResults
                  .filter((result) => typeof result.url === "string")
                  .map((result) =>
                    browser.history
                      .deleteUrl({url: result.url!})
                      .then(() => {
                        totalDeleted++;
                        return true;
                      })
                      .catch((error) => {
                        console.warn(
                          `Failed to delete URL ${result.url}:`,
                          error
                        );
                        return false;
                      })
                  );

                return Promise.all(deletePromises).then(() => {
                  // If we have fewer results than maxResults, we are done
                  if (searchResults.length < maxResults) {
                    return Promise.resolve("completed");
                  }

                  // Otherwise, process the next batch after a short delay
                  return new Promise((resolve) => {
                    setTimeout(() => {
                      resolve(processHistoryBatch());
                    }, 10);
                  });
                });
              })
              .catch((error) => {
                return Promise.reject(error);
              });
          }

          // 開始處理
          processHistoryBatch()
            .then(() => {
              sendResponse({
                status: "success",
                message: `Successfully deleted ${totalDeleted} history items`,
                deletedCount: totalDeleted,
              });
            })
            .catch((error) => {
              console.error("History cleanup failed:", error);
              sendResponse({
                status: "error",
                message: `Failed to clear history: ${error.message || error}`,
              });
            });
        }

        clearHistoryExceptRecent(startTime, endTime, maxResults, sendResponse);
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
