# MVP-14: Currency Migration to EUR

## Status
COMPLETED

## Requirements
Change the default currency of the entire application (Frontend, Backend, Stripe, Printful) from US Dollars (USD/$) to Euros (EUR/€).

## Edge Cases & Improvements Identified
1. **Stripe Integration**: Stripe expects the `currency` field in the `price_data` payload to be `'eur'` instead of `'usd'`. The calculation for cents (`price * 100`) remains the same since both currencies divide into 100 sub-units.
2. **Frontend UI Formatting**: All occurrences of the `$` symbol must be replaced with `€`. This includes the Product detail view, the Cart Drawer, Cart Items, Checkout components, Return page, and Admin Analytics Dashboard.
    - Prefer standard formatting: `€10.00` or `10.00€`. For minimal disruption, we can just replace `$` with `€`.
3. **Printful Integration**: Printful's API for creating orders allows specifying retail costs. If we send `retail_price`, the currency is determined by the Printful Store settings. However, we should be aware that if we rely on Printful's shipping calculation, it might return shipping in the store's default currency. We must ensure the Printful Store is configured in EUR from their dashboard.
4. **Historical Analytics**: Previously processed orders were in USD. The backend stored `amountTotal` in cents. If we just change the display to `€`, past 1000 cents ($10) will show as 10€. For MVP, this conversion is acceptable assuming no real transactions took place yet (or are negligible).

## Implementation Plan
1. **Backend**: 
    - Update `CheckoutService.ts` payload from `currency: 'usd'` to `currency: 'eur'`.
2. **Frontend (Shop)**: 
    - Search and replace `$` in `CartDrawer.tsx`, `CartItem.tsx`, `ProductDetailClient.tsx`, `ProductInfo.tsx` (if any), and `app/return/page.tsx`.
3. **Frontend (Admin)**: 
    - Search and replace UI formatting in `AnalyticsDashboard.tsx` and any Product listing tables (`admin/products/page.tsx` or similar).
4. **Documentation**:
    - Update `task.md`.
