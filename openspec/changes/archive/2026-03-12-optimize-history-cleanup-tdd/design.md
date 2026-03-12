## Context

Currently, `cleanHistory` uses `browser.history.search` to fetch URLs and iteratively calls `browser.history.deleteUrl` on each one. This approach has poor performance with high IPC overhead and causes UI freezing for large history sets. Moreover, `deleteUrl` deletes *all* visits of a given URL, regardless of whether those visits fall within the targeted `startTime` and `endTime`. The browser native API `browser.history.deleteRange` resolves both issues by operating directly on the browser's internal database for a specified time range.
Since we're modifying a core background script, we also want to introduce Vitest to establish a Test-Driven Development (TDD) workflow.

## Goals / Non-Goals

**Goals:**
- Replace the inefficient iteration with `browser.history.deleteRange`.
- Ensure accurate deletion constrained purely by time range (not URL matching).
- Setup Vitest for the project and write unit tests for the time range calculations.
- Update the UI to communicate that the deleted count is approximate (since `deleteRange` does not return the exact count of removed records).

**Non-Goals:**
- We are not changing the core logic or the meaning of the user's `TimeRange` settings (e.g., "Keep 1 Week" still means what it meant).
- We are not modifying other browser extensions APIs beyond `history`.
- We are not performing End-to-End (E2E) browser testing at this time, as creating realistic mock history in a live browser test runner is too complex compared to unit testing `cleanHistory`.

## Decisions

- **Use `browser.history.deleteRange`**: It completely offloads the deletion work to the browser's C++ layer, executing in sub-seconds without IPC bottlenecking.
- **Approximate Count for UI**: Because `deleteRange` resolves to void, we will use `browser.history.search` to fetch up to a certain maximum number of items (e.g., 10000) within the range *before* deleting them, purely to provide the user with a rough count of deleted items. This single search is fast enough.
- **Introduce Vitest**: WXT has excellent Vite integration. Vitest is the natural choice for testing Vite-based projects. We will mock the `browser.history` API to verify the `cleanHistory` inputs and outputs.

## Risks / Trade-offs

- [Risk] `deleteRange` does not return a count of deleted items. → Mitigation: Perform a fast `search` beforehand to get an approximate count for user feedback.
- [Risk] Mocking the WebExtension API in Vitest might be fragile. → Mitigation: Keep the mock simple and focused on tracking arguments passed to `deleteRange`.
