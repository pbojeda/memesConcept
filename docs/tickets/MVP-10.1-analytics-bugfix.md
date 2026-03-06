# MVP-10.1: Analytics Bugfix (Multi-item Orders)

## Status
COMPLETED

## Requirements
Fix the `AnalyticsService` backend aggregation pipelines to support the new `Order` schema which uses an `items` array instead of a single `productId`.

## Edge Cases & Improvements Identified
1. **Top Products Calculation**: Instead of just counting in how many orders a product appeared (`$sum: 1`), we should `$unwind` the `items` array and sum the actual `quantity` sold (`$sum: '$items.quantity'`). This gives a much more accurate "Units Sold" metric.
2. **Filtering by Product**: The dashboard allows filtering global stats by `productId`. The query needs to be updated to match `{'items.productId': ...}`.
3. **Revenue Attribution Edge Case**: If a user filters by a specific product, does "Total Revenue" show the revenue of the *entire cart* or just that *specific item*? Since we don't store individual item prices historically in the `Order`, the easiest robust fix is to fetch the current product price and multiply by the aggregated quantity sold. Alternatively, the metric will represent "Revenue of all orders containing this product" (which we will clarify in the UI). For MVP, we will stick to the latter or implement the `quantity * price` lookup if feasible in the pipeline.

## Implementation Plan
1. Update `AnalyticsService.ts`.
2. Modify `OrderMatch` to use `items.productId` when filtering.
3. Add `$unwind: '$items'` to the top products aggregation pipeline.
4. Update tests if necessary.
