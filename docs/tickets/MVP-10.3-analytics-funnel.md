# MVP-10.3: Analytics Funnel Enhancement

## Status
PLANNED

## Requirements
Update the Sales Funnel metrics to reflect the new multi-item shopping cart flow by injecting an "Add to Cart" event.

## Edge Cases & Improvements Identified
1. **Session Matching**: As users browse anonymously, tracking events are loosely tied. We must ensure `add_to_cart` events are fired correctly from Zustand's `cartStore` actions.
2. **Duplicate Triggers**: If a user clicks "Add to Cart" 5 times to increment quantity, do we fire 5 funnel events or 1? Best practice for funnel steps is unique actions per session, but firing per click is easier. We will implement debouncing or unique session ID deduplication if needed.
3. **Cart Drawer Interactions**: Opening the cart drawer shouldn't necessarily fire a funnel event, only the actual addition of an item.

## Implementation Plan
1. Frontend: Hook into `ProductDetailClient.tsx` "Add to Cart" button to trigger `adminApi.track({ eventType: 'add_to_cart' })`.
2. Backend: Add `add_to_cart` to the allowed event types in `AnalyticsController.ts`.
3. Backend: Update `AnalyticsService.ts` to count `add_to_cart` and insert it as the second step in the Funnel Metrics response.
