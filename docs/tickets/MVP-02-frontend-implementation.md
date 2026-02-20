# Ticket: Initial Frontend Implementation (Product Page)

**Status**: READY_TO_MERGE

## Implementation Plan

### Existing Code to Reuse
- `frontend/src/app/globals.css`: Tailwind directives are already set up.
- `frontend/src/app/layout.tsx`: Root layout to wrap providers.

### Files to Create
#### Utilities & Config
- `frontend/src/lib/utils.ts`: Utility for class merging (`cn`).
- `frontend/src/lib/api.ts`: Axios instance configured for backend URL.
- `frontend/src/providers/QueryProvider.tsx`: React Query provider wrapper.

#### Domain Services
- `frontend/src/services/product.service.ts`: Fetch product details (`GET /products/:id`).
- `frontend/src/services/checkout.service.ts`: Create session (`POST /checkout`).

#### UI Components (Base)
- `frontend/src/components/ui/button.tsx`: Reusable Button component (Radix Slot).
- `frontend/src/components/ui/spinner.tsx`: Loading state indicator.

#### Feature Components
- `frontend/src/components/product/ProductGallery.tsx`: Display product images.
- `frontend/src/components/product/VariantSelector.tsx`: Handle size/color selection.
- `frontend/src/components/product/ProductInfo.tsx`: Layout for title, price, description.
- `frontend/src/components/checkout/BuyButton.tsx`: Triggers checkout session creation.
- `frontend/src/components/checkout/EmbeddedCheckout.tsx`: Renders `<EmbeddedCheckoutProvider>`.

#### Pages
- `frontend/src/app/products/[slug]/page.tsx`: Main Product Detail Page (Server Component).
- `frontend/src/app/return/page.tsx`: Handle Stripe return/success state.

### Files to Modify
- `frontend/src/app/layout.tsx`: Add `QueryProvider`.
- `frontend/src/app/page.tsx`: Redirect to a default product or list products.

### Implementation Order
1.  **Setup**: Install dependencies (`@tanstack/react-query`, `axios`, `clsx`, `tailwind-merge`, `@stripe/react-stripe-js`, `@stripe/stripe-js`, `lucide-react`).
2.  **Utils**: Create `lib/utils.ts` and `lib/api.ts`.
3.  **Providers**: Implement `QueryProvider` and wrap `layout.tsx`.
4.  **Services**: Implement `product.service.ts` and `checkout.service.ts`.
5.  **Components**: Build `Button`, `Spinner`, then `ProductGallery`, `VariantSelector`.
6.  **Checkout Flow**: Build `BuyButton` and `EmbeddedCheckout`.
7.  **Pages**: Assemble `products/[slug]/page.tsx` and `return/page.tsx`.
8.  **Tests**: Create Cypress E2E test `frontend/cypress/e2e/product-checkout.cy.ts`.

### Testing Strategy
-   **Cypress E2E**:
    -   `frontend/cypress/e2e/product-checkout.cy.ts`:
        -   Visit Product Page.
        -   Select Variant.
        -   Click Buy.
        -   Verify Stripe Checkout loads (mocked or checked for existence).
-   **Component Tests** (Optional for MVP): Jest/Vitest for `VariantSelector` logic.

### Key Patterns
-   **Server Components**: Use for initial data fetching (`page.tsx`).
-   **Client Components**: Use for interactive parts (`VariantSelector`, `BuyButton`). Add `'use client'` at top.
-   **Stripe Integration**: Use `EmbeddedCheckoutProvider` for modern flow.
