## Why

Users need more granular control over what browsing data is cleared during the history cleanup process. Currently, the extension focuses primarily on history, but providing options for `cookies`, `cache`, `downloads`, and `form data` enhances privacy management while avoiding deprecated types like `passwords`.

## What Changes

- Add UI options to toggle clearing of `cookies`, `cache`, `downloads`, and `formData`.
- Update the background cleanup logic to use `chrome.browsingData.remove` with the user-selected data types.
- **BREAKING**: None, but modifies the `CleanSettings` structure to include these new data types.

## Capabilities

### New Capabilities
- `browsing-data-cleanup`: Handles the clearing of specific browsing data types (cookies, cache, etc.) using the `browsingData` API.

### Modified Capabilities
- `history-cleanup`: Update existing history cleanup to integrate with the new browsing data options.

## Impact

- UI: New checkboxes in the cleanup settings.
- Store: `clean-setting-store.ts` will need to persist these new preferences.
- Background: `background.ts` cleanup logic.
- Permissions: `browsingData` permission in `manifest.json`.
