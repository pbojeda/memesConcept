# Ticket: MVP Refinement & Features

**Status**: DONE
**Assignee**: @frontend-developer, @backend-developer

## Description
Address critical usability issues and add essential business features (Analytics, Legal) requested by the user.

## Tasks

### 1. Fixes
- **Checkout Modal**: The `EmbeddedCheckout` modal cannot be closed.
  - *Action*: Add a absolute positioned "X" button and/or backdrop click handler.
- **Shipping Address**: Stripe does not ask for shipping address.
  - *Action*: Update `CheckoutService.ts` to include `shipping_address_collection: { allowed_countries: ['US', 'ES', ...] }`.
- **Return Page**: "Does not work" / Needs visual improvement.
  - *Action*: Ensure `session_id` is captured correctly. enhancing UI to clearly state "Order Confirmed".

### 2. Analytics
- **Tool**: PostHog (Free tier, easy event tracking).
- **Implementation**:
  - Create `providers/PostHogProvider.tsx`.
  - Capture `view_item` on Product Detail.
  - Capture `click_buy` on Buy Button.
  - Capture `purchase` on Return Page.

### 3. Legal & Compliance
- **Footer**:
  - Add standard footer to `layout.tsx`.
  - Links: Privacy, Terms, Contact (mailto).
- **Pages**:
  - Create `app/privacy/page.tsx` (Static text).
  - Create `app/terms/page.tsx` (Static text).
- **Cookie Banner**:
  - Simple bottom banner "We use cookies" with "Accept" button.

## Implementation Plan
*(To be generated)*
