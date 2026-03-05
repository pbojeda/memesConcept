# MVP-10.4: Analytics CSV Export

## Status
PLANNED

## Requirements
Add a simple export functionality to download the aggregated dashboard metrics as a `.csv` file.

## Edge Cases & Improvements Identified
1. **Date Formatting**: CSVs are notoriously picky with dates in Excel depending on regional settings. We will format dates in strict `YYYY-MM-DD` standard.
2. **Data Structure**: Since we have aggregated totals, timeline arrays, and list arrays (top products) in the same view, a single CSV isn't perfectly flat. We will generate a "Summary CSV" (1 row with totals) and a "Time-series CSV" (rows by day).
3. **Browser Compatibility**: We will use a robust client-side blob generation technique to avoid hitting the backend just to parse JSON to CSV, saving server resources.

## Implementation Plan
1. Frontend: Add a "Download CSV" button next to the Filters block.
2. Frontend: Implement a utility function to convert the JSON response from `useQuery` into a CSV Blob and trigger a `<a download>` click.
