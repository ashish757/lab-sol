# Known Bugs & Limitations

This document serves as the central tracker for known edge cases, active bugs, and architectural limitations.

## Active Bugs
*(Currently no active bugs reported)*

## Architectural Limitations
- **Offline Mode**: The client currently lacks full offline support. If a factory unit drops internet connectivity, data entry form submissions will fail. Implementation of local-first capabilities (e.g., indexedDB queuing) is not yet supported.
- **Excel Template Restrictions**: The `daily_report_template.xlsx` relies heavily on pre-calculated columns. Altering the structural layout (e.g., inserting new columns manually) will break the coordinate mappings in `shared/excelMapping.ts`.
