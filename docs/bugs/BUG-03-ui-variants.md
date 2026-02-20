# Bug Report: UI and Variant Issues

**Status**: PLANNED
**Created**: 2026-02-19
**Source**: User Feedback

## Description
Several UI and functionality issues were identified during user testing, primarily related to Dark Mode visibility, image rendering in lists, and variant selection behavior.

## Issues

### 1. UI General - Dark Mode Visibility
- **Problem**: When OS switches to Dark Mode, text becomes unreadable (likely dark text on dark background).
- **Cause**: Tailwind classes likely missing `dark:` variants or explicit background/text colors are creating low contrast.
- **Fix**: Force Light Mode in `layout.tsx` (MVP quick fix) OR implement proper Dark Mode support. Given MVP constraints, forcing Light Mode or ensuring high contrast base styles is preferred.

### 2. Product List - Missing Image (User Created)
- **Problem**: Products created manually (via Admin) do not show images in the user-facing Product List (`/` or `/products`).
- **Context**: Admin List works, Product Detail works. Issue is specific to the "Grid" or "Card" component in the Store List.
- **Hypothesis**: The Store List component is still using the legacy `product.imageUrl` and ignoring `product.images[]`.
- **Fix**: Update `ProductCard` (or equivalent) to use the `ProductImage` helper or same logic as Detail/Admin.

### 3. Product Variant Behavior
- **Problem A**: Selecting a Color changes the Size automatically (unexpected).
- **Problem B**: Selecting a Size changes the Color automatically (unexpected).
- **Problem C**: User-created products show Labels instead of Selectable Buttons for variants.
- **Hypothesis C**: If a product has variants but `stock` is 0, or logic in `VariantSelector` is too strict about "Valid Combinations", it might be disabling options. Or, the data structure of user-created variants differs from seeded ones (e.g. strict string matching).
- **Hypothesis A/B**: The `VariantSelector` logic tries to "auto-select" the first valid variant when a dimension changes to prevent invalid states. This might be too aggressive.

## Implementation Plan

### Phase 1: Specifications (`docs/specs/ui-components.md`)
- [ ] Define Dark Mode strategy (Force Light or Fix colors).
- [ ] Clarify `VariantSelector` behavior: "Selection of one dimension should reset the other ONLY if the current combination is invalid; otherwise warn or show out of stock."

### Phase 2: Fixes
1.  **Global Styles**: Add `className="light"` to `<html>` or fix `globals.css` to enforce background/text colors.
2.  **Product List**: Find and update the List Component to handle `images` array.
3.  **Variant Logic**: Refactor `VariantSelector` to decouple Size and Color selection states.
    - Allow selecting Size X even if Color Y is not available (show "Unavailable" instead of auto-switching).
    - Ensure user-created variants are recognized (check data shape).

### Phase 3: Deployment Prep
- [ ] Create `vercel.json` (Frontend)
- [ ] Create `render.yaml` (Backend)
