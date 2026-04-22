## ADDED Requirements

### Requirement: User Selectable Browsing Data Types
The system SHALL provide UI options for users to select which types of browsing data to clear during the cleanup process.

#### Scenario: Displaying browsing data options
- **WHEN** the user opens the cleanup settings UI
- **THEN** checkboxes for "Cookies", "Cache", "Downloads", and "Form Data" SHALL be visible
- **THEN** their states SHALL be persisted in the application state

### Requirement: Granular Browsing Data Deletion
The system SHALL use the `chrome.browsingData.remove` API to delete selected data types within the specified time range.

#### Scenario: Clearing selected data types
- **WHEN** a cleanup job is initiated with `cookies: true` and `cache: true` selected
- **THEN** the system SHALL call `chrome.browsingData.remove` with a `DataTypeSet` where `cookies` and `cache` are `true`
- **THEN** the `since` parameter SHALL match the calculated `startTime` of the cleanup range
