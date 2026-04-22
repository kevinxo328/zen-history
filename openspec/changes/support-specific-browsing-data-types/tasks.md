## 1. Setup & Schema Updates (TDD)

- [x] 1.1 Update `wxt.config.ts` to include `browsingData` permission.
- [x] 1.2 **TDD**: Add a failing test in a new test file (e.g., `test/clean-settings.test.ts`) to verify that `CleanSettingState` should include `browsingDataTypes`.
- [x] 1.3 Update `src/types/clean-settings.ts` to include `browsingDataTypes` interface to pass the test.
- [x] 1.4 **TDD**: Add a failing test for `useCleanSettingStore` to verify it initializes with default browsing data types (all false).
- [x] 1.5 Update `stores/clean-setting-store.ts` state and initial values to pass the test.

## 2. UI Implementation (TDD/Verification)

- [x] 2.1 Add i18n keys for the new browsing data options in `public/_locales`.
- [x] 2.2 **TDD**: Create a component test for `BrowsingDataOptions` (or update existing view tests) to verify checkboxes for Cookies, Cache, Downloads, and Form Data are rendered.
- [x] 2.3 Implement/Update the UI components to pass the component tests.
- [x] 2.4 **TDD**: Add a test to verify that toggling a checkbox updates the `cleanSetting` store.
- [x] 2.5 Implement the store binding to pass the test.

## 3. Core Logic Implementation (TDD)

- [x] 3.1 **TDD**: Create a failing test in `test/history.test.ts` (or a new integration test) that mocks `chrome.browsingData.remove` and verifies it's called when a cleanup job starts if types are selected.
- [x] 3.2 Update the background cleanup function (likely in `src/entrypoints/background.ts` or `src/lib/history.ts`) to import and use the new settings.
- [x] 3.3 Implement the call to `chrome.browsingData.remove` using the selected data types and calculated time range to pass the test.
- [x] 3.4 Ensure the history cleanup still runs alongside the new browsing data cleanup (verified by tests).

## 4. Final Verification & Cleanup

- [x] 4.1 Run all tests (`npm test`) to ensure everything is green and no regressions.
- [x] 4.2 Manual E2E check: Verify UI correctly displays and persists the new settings in the actual browser.
- [x] 4.3 Manual E2E check: Verify that clearing specific types works as expected using the extension's cleanup trigger.

## 5. UI Enhancements

- [ ] 5.1 Update i18n keys to support `{count}` in cleanup success message.
- [ ] 5.2 **TDD**: Update `App.test.ts` to verify that the success message displays the count returned from the background.
- [ ] 5.3 Update `App.vue` to capture `total` from cleanup response and display it in the success state.
- [ ] 5.4 Increase the popup container height by approximately 80px.
