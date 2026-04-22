## MODIFIED Requirements

### Requirement: Optimized History Cleanup
The system SHALL use native browser time-range deletion APIs to clean history and other selected browsing data in order to avoid locking the UI and to accurately remove only the visits/data within the specified time range.

#### Scenario: Deleting history and browsing data within a time range
- **WHEN** the user initiates a cleanup job specifying a `startTime` and `endTime` with additional browsing data types selected
- **THEN** the system calculates an approximate number of affected history items via search
- **THEN** the system calls `browser.history.deleteRange({ startTime, endTime })` for history
- **THEN** the system calls `chrome.browsingData.remove({ since: startTime }, { ...selectedTypes })` for browsing data
- **THEN** the system returns the approximate count and duration of the operation
