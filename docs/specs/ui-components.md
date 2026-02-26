# Frontend UI Component Specification

This document defines the UI components and state management for the Memes Concept MVP.

## Strategies

- **Framework**: Next.js App Router (15+)
- **Styling**: Tailwind CSS
- **State**: React Query (Server State), Zustand (Client State if needed, likely minimal).
- **Payment**: Stripe Embedded Checkout.

## Pages

### 1. Product Detail Page (Primary Landing)
**Route**: `/products/[slug]` or `/` (if we default to a featured product)

**Goal**: Convert visitor to purchaser.

**Components**:
- `ProductGallery`:
  - Props: `images: string[]`
  - Behavior: Carousel or grid of product images.
- `ProductInfo`:
  - Props: `product: Product`
  - Displays: Title, Price, Description.
- `VariantSelector`:
  - Props: `variants: Variant[]`, `onChange: (variant) => void`
  - State: Selected Size, Selected Color.
  - UI: Button group for sizes, Color swatches (if color exists).
- `BuyButton`:
  - Props: `productId: string`, `selectedVariant: Variant`
  - Behavior: Triggers `checkout` mutation.
- `CheckoutModal` (or Inline):
  - Behavior: renders `<EmbeddedCheckoutProvider>` from Stripe.

### 2. Success Page
**Route**: `/success`

**Goal**: Confirm purchase.

**Components**:
- `OrderConfirmation`:
  - Displays: "Thank you for your order!", Order Details (if retrievable via session_id).

## State Management

### Server State (React Query)
- `useProduct(slug)`: Fetches product details.
- `useCreateCheckoutSession()`: Mutation to POST `/checkout`.

### Client State (Local/Zustand)
- `cartStore` (Optional for MVP, maybe just direct buy):
  - `items`: Array of selected products.
  - *Decision*: For MVP, we might stick to "Buy Now" flow (Direct Checkout) to simplify.

## Design System (Radix UI + Tailwind)

- **Typography**: Inter or similar sans-serif.
- **Colors**:
  - Primary: Violet/Purple (Memey/Vibrant).
  - Background: Dark mode default?
- **Components**:
  - `Button`: Radix Slot + Tailwind.
  - `Dialog`: Radix Dialog (for Checkout).
  - `Select`: Radix Select (for Variants if many).

### 3. Admin Dashboard
**Route**: `/admin/products`

**Goal**: Manage products.

**Components**:
- `ProductList`:
  - Table showing Name, Price, Actions (Edit/Delete).
- `ProductForm`:
  - Inputs: Name, Slug, Price, Description.
  - `ImageUpload`:
    - Input type='file'.
    - On change, calls `POST /admin/upload`.
    - Displays preview of uploaded image.
    - Returns URL to parent form.

### 4. Admin Analytics (MVP-10)
**Route**: `/admin` (or `/admin/analytics`)

**Goal**: View store performance metrics and marketing KPIs.

**Components**:
- `AnalyticsDashboard`:
  - Main container fetching data from `GET /admin/analytics`.
- `DashboardFilters`:
  - `DateRangePicker`: Allows filtering by custom dates (e.g. Last 7 Days, Last 30 Days).
  - `ProductSelector`: Dropdown to filter analytics by a specific product.
- `MetricCard`:
  - Props: `title: string`, `value: string`, `icon: LucideIcon`
  - Displays: Total Revenue, Total Orders, Conversion Rate, Page Views.
- `FunnelChart` (or Metrics Breakdown):
  - Visualizes: `Page Views` > `Checkouts Initiated` > `Purchases Completed`.
- `TopProductsTable`:
  - Props: `products: {productName: string, salesCount: number}[]`
  - Displays a clean list of the top-performing products.
- `TrafficSourcesList`:
  - Displays where the users are coming from (Referrers, Direct, Social).

## Security
- Admin pages protected by NextAuth Session Validation (JWT Token injection).

## Shared Components (Helpers)
- `ProductImage`:
  - Props: `product: Product`, `className?: string`
  - Logic: Prioritizes `product.images[0]`, falls back to `product.imageUrl`, then placeholder.
  - Rationale: Handled migration from legacy schema.
- `VariantSelector`:
  - Props: `variants: ProductVariant[]`, `selected?: ProductVariant`, `onChange: (v) => void`
  - UI: Displays available sizes/colors. Disables out of stock options.
- `SimilarProducts` (Cross-Selling):
  - Props: `currentProductId: string`
  - Logic: Fetches all products, strips the current one, and returns a grid of 4 random products.
- `GoBackButton`:
  - Logic: Native `next/link` wrapped with a Lucide `ArrowLeft` icon for simple mobile back routing on Product Pages.
