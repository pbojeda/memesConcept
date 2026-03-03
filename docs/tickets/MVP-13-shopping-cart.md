# MVP-13: Shopping Cart Feature

## Status
COMPLETED

## Requirements

The core feature is to allow users to buy more than one product in a single transaction.

1. **Frontend - Product Details**:
   - Add a unit selector to add multiples of the same product to the cart.
   - Replace direct "Buy Now" flow with "Add to Cart".

2. **Frontend - Cart Page**:
   - New dedicated Cart Page (or sliding modal).
   - Display a list of products added (with variants).
   - Provide controls to increase/decrease units.
   - Provide a way to remove a product entirely from the cart.

3. **Backend - Stripe Checkout**:
   - Refactor the `/checkout` endpoint to accept an array of items (`CheckoutSessionRequest`).
   - Create Stripe Checkout Sessions with multiple line items.

4. **Backend - Printful Webhook**:
   - Ensure the Stripe webhook handler maps multiple order items to a single Printful order.
   - Validate that Printful receives all products accurately.

## Pre-requisites
- Existing Stripe & Printful integrations working (they are).

## Implementation Plan (Backend)

### Existing Code to Reuse
- `Order` Entity (`backend/src/domain/models/Order.ts`), needs refactoring.
- `PrintfulService` (`backend/src/infrastructure/services/PrintfulService.ts`) which already handles multiple items.
- `StripeWebhookController` (`backend/src/presentation/controllers/StripeWebhookController.ts`)

### Files to Modify
1. `backend/src/domain/models/Order.ts`: 
   - Update `IOrder` interface and Mongoose schema to replace `productId`, `quantity`, and `variant` with an `items` array of objects `{ productId, quantity, variant }`.
2. `backend/src/application/services/CheckoutService.ts`: 
   - Refactor `createCheckoutSession` to accept `items` instead of a single product.
   - Fetch prices for all items and construct a multi-item `line_items` array for Stripe.
   - Save the `Order` with the `items` array.
3. `backend/src/presentation/controllers/StripeWebhookController.ts`: 
   - Refactor the completion handler to correctly map the `items` array to Printful's order format via `PrintfulService`.
4. `shared/src/schemas/order.ts`: 
   - (Already supports `items`, ensure no conflicts).

### Implementation Order
1. Backend Domain: Modify `Order.ts` schema and interface.
2. Backend Application: Refactor `CheckoutService.ts`.
3. Backend Presentation: Update `StripeWebhookController.ts`.
4. Tests: Update unit tests for CheckoutService and WebhookController.

### Testing Strategy
- Unit test `CheckoutService` to ensure `line_items` are calculated correctly for multiple products.
- Test webhook parsing to ensure Printful receives the correct item array.

## Implementation Plan (Frontend)

### Existing Code to Reuse
- `ProductDetailClient.tsx`
- `checkout.service.ts`

### Files to Create
1. `frontend/src/store/cartStore.ts`: Zustand store for managing cart state (persist to localStorage).
2. `frontend/src/components/ui/QuantitySelector.tsx`: Reusable component to increase/decrease quantity.
3. `frontend/src/components/cart/CartDrawer.tsx`: Slide-over lateral panel showing cart items and summary.
4. `frontend/src/components/cart/CartItem.tsx`: Individual item display inside the CartDrawer.
5. `frontend/src/components/layout/Header.tsx`: Global header containing the Cart icon.

### Files to Modify
1. `frontend/src/services/checkout.service.ts`: Update `CreateCheckoutSessionRequest` to accept an `items` array.
2. `frontend/src/components/product/ProductDetailClient.tsx`: Integrate `QuantitySelector` and replace Buy directly by "Add to Cart" pushing to `cartStore`.
3. `frontend/src/app/layout.tsx`: Integrate the new `Header` and `CartDrawer` so they are accessible globally.

### Implementation Order
1. Frontend State: Create `cartStore.ts`.
2. Frontend Services: Update `checkout.service.ts`.
3. Frontend UI: Create `QuantitySelector`, `CartItem`, `CartDrawer`, `Header`.
4. Frontend Integration: Update `ProductDetailClient.tsx` and `layout.tsx`.

### Testing Strategy
- Update Cypress E2E tests (`frontend/cypress/e2e/product-checkout.cy.ts`) to:
  - Add multiple units of a product.
  - Add multiple distinct products.
  - Modify quantities within the Cart Drawer.
  - Assert the checkout redirection sends the correct multi-item payload.
