# Changelog

## v0.2.3 (2026-04-28)

### Improvements

- **Security & Maintenance** — Updated internal dependencies to ensure the extension remains secure and reliable.

## v0.2.2 (2026-04-23)

### Bug Fixes

- **Arc Browser Compatibility** — Fixed an issue where clicking the settings button in the popup did not open the settings page when using the Arc browser. The extension now uses a more compatible method to open new tabs.

## v0.2.1 (2026-04-23)

### Bug Fixes

- **Keep Recent Safety** — In "Keep Recent" mode, browsing data (cookies, cache, downloads, etc.) is no longer cleared. The Chrome API does not support an "until" parameter, making this operation unsafe and potentially destructive to recent sessions.
- **Disabled Unavailable Options** — Browsing data switches are now visually dimmed and disabled when "Keep Recent" mode is active, accurately reflecting that these options have no effect in this mode.

## v0.2.0 (2026-04-23)

### New Features

- **Settings Redesign** — A completely revamped settings interface with better layout and real-time state synchronization.
- **Scheduled Cleaning** — You can now schedule a specific time for daily automatic history cleanup.
- **Enhanced Data Control** — Added experimental support for selecting specific browsing data types to clean, such as downloads, cookies, or cache.
- **Language Support** — Added a language selection menu to switch the app's interface language.
- **Feedback & Support** — Added a direct link to report bugs in the settings menu.

### Improvements

- **Performance Optimization** — Improved the speed and efficiency of history item counting.
- **Smarter Locale Sync** — App language settings now sync seamlessly between the store and the interface.
- **Organized Settings** — Advanced data settings have been moved to a dedicated tab for a cleaner experience.


## v0.1.1 (2026-03-12)

### Improvements

- Optimized history cleaning performance so that your browsing history is cleared more reliably and quickly across specified time ranges.

## v0.1.0 (2025-12-04)

### New Features

- **History Cleaning** — One-click to clear browsing history within specific time ranges.
- **Auto Clean** — Automatically clear history at scheduled times (e.g., every midnight).
- **Internationalization** — Full support for multiple languages including English and Traditional Chinese.
- **Cleaning Feedback** — Visual indicators and animations to show the progress and result of the cleaning process.
- **Smart Analytics** — View the duration and total items cleared in the last auto-clean cycle.
- **Auto Save** — Settings are automatically saved and restored when the extension is reopened.
