# Implementation Plan - memesConcept MVP

This plan outlines the steps to build a Minimum Viable Product (MVP) for a meme-based merchandising store within 2 days, following a Spec-Driven Development approach as requested.

## User Review Required

> [!IMPORTANT]
> **Frontend Strategy**: The user emphasized analyzing options.
> *   **Option A: Vite (React SPA)**: Fastest setup, great dev experience. Cons: Poor SEO native support (requires complex workarounds), slower initial load.
> *   **Option B: Astro**: Excellent performance, great SEO. Cons: different mental model for state (islands), might be overkill for a dynamic "app-like" checkout flow if not careful.
> *   **Option C: Next.js (App Router)**: **SELECTED**. Best balance. Native SEO (critical requirement), robust standard, easiest Stripe integration, supports the requested "Product Page to Checkout" flow seamlessly.
>
> *Decision*: We will use **Next.js** with **Tailwind CSS** and **Radix UI** (for accessible primitives).

> [!NOTE]
> **Backend Simplicity**: We will skip Prisma to avoid setup overhead/migration complexity for this MVP. We will use **Mongoose** (straightforward MongoDB schema) or native drivers if preferred, but Mongoose + Zod is a robust, standard combo.
> **Libraries**: `zod` for validation, `pino` for logging.

## Proposed Changes

### 1. Project Configuration (Current Focus)
- **Workflows**:
    - Create `.agent/workflows/spec-driven-feature.md`: Guide for the Spec -> Test -> Code cycle.
    - Create `.agent/workflows/review-specs.md`: Checklist for reviewing specs.
- **Skills**:
    - Create `.agent/skills/spec-creator/SKILL.md`: Best practices for OpenAPI and UI specs.
    - Create `.agent/skills/code-reviewer/SKILL.md`: Checklist for code reviews (Zod, Typescript, etc.).
- **Documentation**:
    - Update `GEMINI.md`: Add "Workflows" section and link to new skills.

### 2. Project Initialization & Structure
Monorepo structure with independent `backend` and `frontend` folders.

### 3. Specification Phase (Spec-Driven)
**Strict Rule**: Specs defined *before* code.

#### Backend Specification (`docs/specs/openapi.yaml`)
- **Format**: OpenAPI 3.0
- **Focus**: Minimum endpoints for the Product Page -> Checkout flow.
    - `GET /products/{slug/id}`: Detailed product info.
    - `POST /checkout`: Create Stripe Embedded Checkout Session (payload: product_id, quantity, size, color).
    - `POST /webhook/stripe`: Handle Stripe events (payment success).
    - `POST /contact`: Simple lead gen.

#### Frontend Specification (`docs/specs/ui-components.md`)
- **Primary Page**: `ProductDetailPage` (Landing).
    - Components: `ProductGallery`, `VariantSelector` (Size/Color), `BuyButton`.
    - **Stripe Integration**: **Stripe Embedded Checkout** (`<EmbeddedCheckoutProvider>`).
      *Rationale*: Meets the user request for a "widget" that facilitates work. It keeps the user on the site (unlike Hosted) but avoids building complex forms (unlike Elements).
- **Secondary**: `SuccessPage` (handled by Stripe redirect or embedded state), `ProductGrid` (Home).

#### Phase 2: Backend Implementation (MVP-01) - **DONE**
- [x] **Infrastructure**: Mongoose, Stripe SDK, Zod, Pino.
- [x] **Domain Models**: `Product`, `Order` (Mongoose Schemas).
- [x] **Features**:
  - `GET /products`, `GET /products/:id`
  - `POST /checkout` (Stripe Session creation)
  - `POST /webhook` (Stripe signature verification)
- [x] **Testing**: Jest Integration Tests for all endpoints.

### 5. Frontend Implementation (`frontend/`) - **DONE**
- [x] **Stack**: **Next.js**, **Tailwind CSS**, **Radix UI**.
- [x] **Stripe**: `@stripe/stripe-js`, `@stripe/react-stripe-js`.
- [x] **Key Tasks**:
    - [x] Setup Next.js + Tailwind + Radix.
    - [x] **Step 1**: Implement `ProductDetailPage`. 
    - [x] **Step 2**: specific component for `<EmbeddedCheckout />`.
    - [x] **Step 3**: `SuccessPage`.
    - [x] **Step 4**: (If time permits) `HomePage` product grid.

### 6. Phase 3: MVP Refinement & Features (`frontend/` & `backend/`) - **DONE**
- [x] **Fixes**:
  - [x] **Checkout Modal**: Add "Close" button to `EmbeddedCheckoutComponent`.
  - [x] **Shipping**: Enable `shipping_address_collection` in Stripe Session (Backend).
  - [x] **Return Page**: Improve UI and feedback stability.
- [x] **Analytics (PostHog)**:
  - [x] Setup `PostHogProvider`.
  [x] Track events: `page_view`, `view_product`, `initiate_checkout`.
- [x] **Legal & Compliance**:
  - [x] **Footer**: Contact info, links.
  - [x] **Pages**: `Privacy Policy`, `Terms of Service`.
  - [x] **Cookie Banner**: Simple consent banner.

### 7. Phase 4: Admin Dashboard, Shared Lib & Cloudinary (`frontend/` & `backend/` & `shared/`)
- [ ] **Shared Library** (Refactor):
  - [ ] Create `shared/` with Zod schemas.
  - [ ] Link `shared` to Frontend/Backend via tsconfig paths.
  - [ ] Refactor `Product` types to use Shared Zod Schema.
- [ ] **Backend**:
  - [ ] **Cloudinary**: Setup `cloudinary` SDK and `uploadString` / `uploadStream`.
  - [ ] **Endpoints**: `POST /products` (Auth required?), `PUT /products/:id`, `DELETE /products/:id`.
  - [ ] **Auth**: Simple Admin Middleware (e.g., Hardcoded secret header or Basic Auth for MVP).
  - [/] **Frontend**:
    -   [x] **Admin Page**: `/admin/products`.
    -   [x] **Components**: `ProductForm`, `ImageUpload`.
    -   [ ] **Refinement**: Fix Image display (legacy support), Cache invalidation, Delete Modal.
  - [ ] **Store Enhancements**:
    -   [ ] **Variants**: `VariantSelector` in Product Detail.
    -   [ ] **Checkout**: Pass variant data to Stripe.

### 8. Phase 5: CI/CD, Documentation & Deployment
- [ ] **CI/CD**:
  - [ ] Optimize GitHub Actions (Backend/Frontend split).
  - [ ] Add "Release" workflow.
- [ ] **Documentation**:
  - [ ] `README.md`: "How to Start", "How to Test", "Deployment Guide".
- [x] **Deployment Setup**:
  - [x] **Frontend**: Setup code for Vercel deployment.
  - [x] **Backend**: Created Dockerfile in `backend/` for Render deployment (handling monorepo context via Root).
  - [x] **Fixes**: Corrected image aspect ratios natively and resolved state synchronization bugs in `<VariantSelector/>`.
  - [ ] **Verify**: Production Smoke Test.

### 9. Missing MVP Analysis
- [ ] **Security**: Rate limiting (Backend)? 
- [ ] **SEO**: Dynamic Metadata for Products.
- [ ] **Metrics**: Verify PostHog events in dashboard.

## Verification Plan

### Configuration Verification
- **Manual**: Check that `GEMINI.md` references the new workflows.
- **Manual**: Verify `review-specs` workflow content fits the project rules.

### Automated Tests
- **Backend Unit**: Jest + Supertest. Test Zod validation rules rigidly.
- **Frontend E2E**: Cypress.
    - Test Flow: Visitor lands on Product Page -> Selects Size "M" -> Clicks Buy -> Fills Stripe Form -> Sees Success.

### Manual Verification
- **Visual**: Verify "Meme" aesthetic (modern, vibrant).
- **Functional**: Complete a purchase in Stripe Test Mode.
