## ADDED Requirements

### Requirement: Optimized History Cleanup
The system SHALL use native browser time-range deletion APIs to clean history in order to avoid locking the UI and to accurately remove only the visits within the specified time range.

#### Scenario: Deleting history within a time range
- **WHEN** the user initiates a cleanup job specifying a `startTime` and `endTime`
- **THEN** the system calculates an approximate number of affected items via search
- **THEN** the system calls `browser.history.deleteRange({ startTime, endTime })` exactly once
- **THEN** the system returns the approximate count and duration of the operation

#### Scenario: Deleting when search returns empty
- **WHEN** the user initiates a cleanup but there are no history items in the specified time range
- **THEN** the system skips calling `browser.history.deleteRange`
- **THEN** the system returns 0 for the approximate count

### Requirement: Approximate Deletion UI
The popup UI SHALL inform the user that the number of deleted items is approximate.

#### Scenario: Displaying completion message
- **WHEN** a cleanup job completes successfully
- **THEN** the UI notification shows "Successfully deleted ~X history items in Yms" (or similar wording indicating approximation)
