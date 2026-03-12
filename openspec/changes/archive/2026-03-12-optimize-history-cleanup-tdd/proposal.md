## Why

The current history cleanup implementation (`cleanHistory` in `background.ts`) retrieves up to 1000 items at a time and calls `browser.history.deleteUrl` for each one recursively. This causes severe performance issues (UI freezing, browser database locks) when processing large amounts of history due to massive IPC overhead. Additionally, `deleteUrl` deletes *all* visits for a given URL, even if some visits fall outside the specified time range, which is a hidden logical bug. We need to optimize this by using the native `browser.history.deleteRange` API, and introduce Vitest for Test-Driven Development (TDD) to ensure correctness.

## What Changes

- **Optimization**: Replace the recursive `search` + `deleteUrl` loop with a single `browser.history.deleteRange` call.
- **Bug Fix**: Only delete visits within the requested time range, rather than all visits for matched URLs.
- **UI Modification**: Since `deleteRange` does not return the exact number of deleted items, the UI will be updated to display an "approximate" count (derived from a prior `search` with a max limit).
- **TDD Setup**: Introduce `vitest` to the project for unit testing.
- **Unit Tests**: Add tests to verify time range calculations (`startTime` and `endTime`) and API calling logic for `cleanHistory`.

## Capabilities

### New Capabilities
- `history-cleanup`: The core capability of cleaning browser history based on defined time ranges (Keep Recent vs. Remove Recent), now utilizing optimized native APIs.

### Modified Capabilities
- (None existing yet, this is the first documented capability for this feature)

## Impact

- `src/entrypoints/background.ts`: Complete refactoring of `cleanHistory`.
- `package.json`: Addition of `vitest` and related testing dependencies.
- `src/entrypoints/popup/App.vue`: Minor UI text adjustments to indicate approximate deletion counts.
- `test/` (or similar): New directory for Vitest test files.
