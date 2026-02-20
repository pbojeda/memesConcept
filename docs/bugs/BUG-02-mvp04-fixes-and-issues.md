
# BUG-02: MVP-04 Admin Dashboard & Variants Feedback

## 1. Resolved Issues (Frontend & Admin)
- **Hydration Mismatch**: Fixed by suppressing hydration warnings in `layout.tsx` (caused by browser extensions).
- **Unauthorized (401)**: Fixed by adding explicit GET routes to Admin Router and logging authentication attemps.
- **Payload Too Large**: Fixed by increasing backend body limit to 50MB to support Base64 images.
- **Duplicate Thumbnails**: Fixed in `ImageUpload` component to hide internal preview when handled by parent.
- **Slug**: Made optional (auto-generated from name) and Description made required.
- **Variants Input**: Added dynamic fields for Size/Color/Stock in `ProductForm`.

## 2. Open Issues (Admin Dashboard)
- **List Images**: Existing products don't show images in the list.
  - *Cause*: Likely using `imageUrl` field (legacy) instead of `images` array in `ProductList`.
- **Create Refresh**: List doesn't reload after creation.
  - *Cause*: `router.refresh()` might be race-conditioned with React Query cache.
- **Delete Modal**: Disappears immediately.
  - *Cause*: UI component state issue or event propagation.

## 3. Open Issues (Store Frontend)
- **Missing Images**: New products don't show images in List/Detail.
  - *Cause*: Frontend components might be looking for `imageUrl` only.
- **Missing Variants**: Product Detail page doesn't show variants.
  - *Cause*: `VariantSelector` component not implemented or not integrated.
- **Checkout Integration**: Cannot select variants for purchase.
  - *Cause*: Checkout logic doesn't support variant selection yet.

## 4. Requirements
- **Stripe Variants**: Pass selected variant (Size/Color) to Stripe Checkout session metadata/line items.
