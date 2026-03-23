# MVP-16: Spanish Translation & UI Polish

## Overview
Translate the customer-facing frontend into Spanish, improve the legal pages, and fix UI UX issues like missing pointer cursors on desktop.

## Specifications

### UI Updates
1. **Cookie Banner (`src/components/ui/CookieBanner.tsx`)**:
   - Translate text to Spanish.
   - Button text: "Aceptar".
   - Ensure the link to the cookie policy (or privacy policy) is in Spanish and is trackable.

2. **Footer (`src/components/ui/Footer.tsx`)**:
   - Translate links to Spanish ("Política de Privacidad", "Términos y Condiciones", "Contacto").
   - Update `app/privacy/page.tsx` and `app/terms/page.tsx` with more robust, professional Spanish legal texts.

3. **Cart (`src/components/cart/CartDrawer.tsx` & `CartItem.tsx`)**:
   - "Shopping Cart" -> "Carrito".
   - "Your cart is empty" -> "Tu carrito está vacío".
   - "Total" -> "Total".
   - "Checkout" -> "Tramitar Pedido".
   - "Continue Shopping" -> "Seguir Comprando".
   - "Size" -> "Talla", "Color" -> "Color".

4. **Product Details & Variants (`VariantSelector.tsx` etc)**:
   - "Add to Cart" -> "Añadir al carrito".
   - "Back" -> "Volver al inicio" (or similar).
   - "Size" -> "Talla", "Color" -> "Color", "Select..." -> "Seleccionar...".
   - Map English Printful colors to Spanish for UI display (e.g., "Black" -> "Negro", "Navy" -> "Azul Marino") so they appear in Spanish to the user while keeping the English values for internal logic and checkout.
   - Fix missing `cursor-pointer` (or `hover:opacity-80`) on buttons so they feel clickable on desktop.

5. **Payment Methods / Stripe (`backend/src/application/services/CheckoutService.ts`)**:
   - Ensure the Stripe Embedded Checkout / Stripe Session uses `locale: 'es'` to show payment methods in Spanish.

## Implementation Plan

1. **Modify `CookieBanner.tsx`**: Replace English text with Spanish text.
2. **Modify `Footer.tsx`**: Update link labels to Spanish.
3. **Update Legal Pages (`app/privacy/page.tsx`, `app/terms/page.tsx`)**: Replace the current drafted text with a comprehensive Spanish version.
4. **Modify `CartDrawer.tsx` and `CartItem.tsx`**: Replace hardcoded English strings with Spanish. Add `cursor-pointer` to clickable elements if missing (buttons usually have it, but we'll double check).
5. **Modify Product Components (`ProductInfo.tsx`, `VariantSelector.tsx`, `ProductDetailClient.tsx`)**: 
   - Translate "Add to Cart" and labels "Size"/"Color". 
   - Implement a simple `colorTranslations` record to map "Black" to "Negro", etc.
6. **Modify `ProductDetailClient.tsx` or similar**: Translate the "Back" button text.
7. **Modify Stripe Config (`backend/src/application/services/CheckoutService.ts`)**: Update `stripe.checkout.sessions.create` call to include `locale: 'es'`.

## Verification Plan

- **Manual Testing**:
  - Open the website, verify the Cookie banner reads in Spanish.
  - Hover over the Add to Cart button and Cart icons to ensure the cursor changes to a pointer.
  - Add an item to the cart, open the drawer, and verify all text is in Spanish.
  - Click "Tramitar Pedido" and verify the Stripe checkout page is displayed in Spanish.
  - Browse `/privacy` and `/terms` to verify the extended Spanish texts.
- **E2E Tests**:
  - Update any Cypress tests that rely on English text (e.g., `cy.contains('Shopping Cart')` to `cy.contains('Carrito')`).
