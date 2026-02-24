# Frontend Feature: Variants UI & Checkout Sync

**Status**: PLANNED
**Priority**: HIGH
**Assignee**: @frontend-planner / @frontend-developer

## Description
With the backend fully integrated with Printful, the frontend must ensure that the `VariantSelector` correctly identifies and passes the exact variant selected by the user to the Stripe Checkout session. This ensures that the Printful fulfillment webhook receives the correct variant information (e.g., size, color, Printful Sync Variant ID) when the order is paid.

## Requirements
1. **Product Detail Page**: The `VariantSelector` component must correctly parse the variants from the backend (which now include `printfulVariantId`).
2. **Checkout Integration**: When clicking "Buy", the selected variant's `size` and `color` must be sent to the `POST /checkout` endpoint.
3. **E2E Testing**: Add Cypress tests to verify the flow from product selection with a specific variant to the checkout initiation.

## Implementation Plan
### Step 1: Update API & UI Types
- Check if `frontend/src/lib/api.ts` `checkout` function accepts variant details.
- Ensure the `<ProductDetail>` or `<VariantSelector>` keeps state of the selected variant.
- Verify `frontend/src/app/products/[slug]/page.tsx` passes the selected variant correctly when initiating the Stripe Checkout session.

### Step 2: Ensure correct data mapping in Checkout Call
- Modify the payload sent to `POST /checkout` to include the selected variant:
  ```typescript
  {
     productId: product.id,
     quantity: 1,
     variant: { size: selectedVariant.size, color: selectedVariant.color }
  }
  ```

### Step 3: Run E2E Tests
- Run existing cypress tests.
- Add or update a cypress test to ensure variant selection works and is passed to checkout.

## Review & Validation
- Manually test selecting a Variant and clicking buy. Verify network request payload.
- Cypress passes.
