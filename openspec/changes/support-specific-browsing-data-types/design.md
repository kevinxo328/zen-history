## Context

The extension currently supports clearing history based on time ranges. We want to extend this to support `cookies`, `cache`, `downloads`, and `formData` using the `chrome.browsingData` API. The UI needs to be updated to allow users to toggle these options.

## Goals / Non-Goals

**Goals:**
- Provide checkboxes for `cookies`, `cache`, `downloads`, and `formData` in the cleanup settings.
- Persist these settings in `clean-setting-store.ts`.
- Update the cleanup logic to include these data types if selected.
- Ensure the time range logic applies to these data types as well.

**Non-Goals:**
- Support clearing `passwords` (deprecated/removed in Chrome 144).
- Support clearing `localStorage`, `indexedDB`, etc. (out of scope for now).

## Decisions

- **Data Structure**: Add a `dataTypes` object to `CleanSettingState`.
  ```typescript
  dataTypes: {
    cookies: boolean;
    cache: boolean;
    downloads: boolean;
    formData: boolean;
  }
  ```
- **UI Placement**: Place the new options under a new "Browsing Data" header in the cleanup settings view. Use a vertical list of checkboxes for clarity.
- **Cleanup Implementation**: Use `chrome.browsingData.remove` which accepts both a time range and a data type set. This avoids multiple API calls for different types.
- **Timing Logic**: The existing `since` calculation for history will be reused for `browsingData.remove`.

## Risks / Trade-offs

- [Risk] → `browsingData` API requires extra permission.
- [Mitigation] → Add `browsingData` to `manifest.json`.
- [Risk] → Clearing cookies might sign out users from some sites.
- [Mitigation] → Clear UI labels and potentially a tooltip explaining the impact.
