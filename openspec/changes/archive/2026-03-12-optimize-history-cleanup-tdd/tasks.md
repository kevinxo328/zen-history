## 1. Setup Testing Environment

- [x] 1.1 Install `vitest` and related testing dependencies in `package.json`.
- [x] 1.2 Configure `vitest` in the project root.
- [x] 1.3 Create a mock setup for WebExtension APIs (specifically `browser.history`) to be used in tests.

## 2. Refactor History Cleanup Logic (TDD)

- [x] 2.1 Extract the core logic of `cleanHistory` into a testable module/function if necessary (or keep it in `background.ts` and test directly).
- [x] 2.2 Write failing unit tests for the time range calculations (`startTime` and `endTime`) based on the various user settings (e.g., Keep 1 Week, Remove Past Hour).
- [x] 2.3 Write failing unit tests to verify that `cleanHistory` first calls `browser.history.search` to get an approximate count, and then calls `browser.history.deleteRange` with the correct `startTime` and `endTime`.
- [x] 2.4 Update `cleanHistory` to use `browser.history.deleteRange` and make the tests pass.
- [x] 2.5 Ensure the function returns the correct `total` (approximate) and `duration`.

## 3. UI Updates

- [x] 3.1 Update the completion message logic in `src/entrypoints/background.ts` or `src/entrypoints/popup/App.vue` to indicate that the deleted count is approximate (e.g., adding a `~` prefix or changing the wording).
- [x] 3.2 Ensure internationalization (i18n) files (`en.json`, `zh_TW.json`) are updated if the success message keys/values change.
