# Ticket: Initial Backend Implementation (Product & Checkout)

**Status**: READY_TO_MERGE
**Assignee**: @backend-developer

## Description

Implement the core backend functionality for the Memes Concept MVP.
This includes the product retrieval endpoints and the Stripe Checkout session creation.

## Specifications

- **API Spec**: `docs/specs/openapi.yaml` (Endpoints: `/products`, `/products/:id`, `/checkout`, `/webhook/stripe`)
- **Standards**: `ai-specs/specs/backend-standards.mdc`

## Requirements

1.  **Database**:
    - Define Mongoose schemas for `Product` and `Order` (if needed for webhook).
    - Seed script to populate initial meme products (needed for testing).

2.  **API**:
    - `GET /products`: Return list of products.
    - `GET /products/:id`: Return single product details.
    - `POST /checkout`: Accept `productId`, `quantity`, `variant`. Create Stripe Session. Return `clientSecret`.
    - `POST /webhook/stripe`: Validate signature. Log success.

3.  **Validation**:
    - Use Zod to validate `POST /checkout` body strictly.

## Implementation Plan

### Existing Code to Reuse
- `backend/src/index.ts`: Entry point (needs modification for routes).
- `backend/src/infrastructure/`: Empty, needs Mongoose connection.
- `backend/src/domain/models/`: Empty, needs Mongoose schemas.
- `backend/src/presentation/routes/`: Empty, needs Express routes.

### Files to Create

#### Domain Layer
- `backend/src/domain/models/Product.ts`: Mongoose schema and interfaces for Product.
- `backend/src/domain/models/Order.ts`: Mongoose schema for Order (to track Stripe sessions).
- `backend/src/domain/errors.ts`: Custom error classes (NotFoundError, ValidationError).

#### Infrastructure Layer
- `backend/src/infrastructure/database.ts`: Mongoose connection logic.
- `backend/src/infrastructure/stripe.ts`: Stripe SDK initialization and helper methods.
- `backend/src/infrastructure/config.ts`: Environment variable validation (Zod).

#### Application Layer
- `backend/src/application/services/ProductService.ts`: Logic to fetch products.
- `backend/src/application/services/CheckoutService.ts`: Logic to create Stripe Sessions.
- `backend/src/application/validators/checkoutValidator.ts`: Zod schema for `/checkout` body.

#### Presentation Layer
- `backend/src/presentation/controllers/ProductController.ts`: Handlers for `GET /products` and `/:id`.
- `backend/src/presentation/controllers/CheckoutController.ts`: Handler for `POST /checkout`.
- `backend/src/presentation/controllers/WebhookController.ts`: Handler for Stripe Webhooks.
- `backend/src/presentation/routes/productRoutes.ts`: Router for products.
- `backend/src/presentation/routes/checkoutRoutes.ts`: Router for checkout.
- `backend/src/presentation/routes/webhookRoutes.ts`: Router for webhooks.

#### Support
- `backend/scripts/seed.ts`: Script to populate MongoDB with initial Meme Products.

### Files to Modify
- `backend/src/index.ts`: Register new routes and database connection.
- `backend/.env.example`: Add `MONGO_URI`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.

### Implementation Order

1.  **Infrastructure**: Setup `config.ts`, `database.ts`, and `stripe.ts`.
2.  **Domain**: Create `Product.ts` and `Order.ts` schemas.
3.  **Seed**: Create and run `scripts/seed.ts` to have data.
4.  **Product Feature**:
    -   Service: `ProductService.ts`
    -   Controller: `ProductController.ts`
    -   Routes: `productRoutes.ts`
    -   **Test**: `tests/integration/products.test.ts`
5.  **Checkout Feature**:
    -   Validator: `checkoutValidator.ts`
    -   Service: `CheckoutService.ts` (init Stripe session)
    -   Controller: `CheckoutController.ts`
    -   Routes: `checkoutRoutes.ts`
    -   **Test**: `tests/integration/checkout.test.ts`
6.  **Webhook Feature**:
    -   Controller: `WebhookController.ts`
    -   Routes: `webhookRoutes.ts`
    -   **Test**: `tests/integration/webhook.test.ts`
7.  **Main Entry**: Update `index.ts` to wire everything up.

### Testing Strategy

-   **Integration Tests (Supertest)**:
    -   `GET /products`: Verify it returns 200 and the seeded list.
    -   `GET /products/:id`: Verify 200 for valid ID, 404 for invalid.
    -   `POST /checkout`:
        -   Verify 200 + `clientSecret` for valid payload.
        -   Verify 400 for missing fields (Zod validation).
        -   Verify 400/404 if product doesn't exist.
    -   `POST /webhook/stripe`: Verify 200 signature validation (mock Stripe).

### Key Patterns
-   **Service Layer**: Controllers should not contain business logic; delegate to Services.
-   **Dependency Injection**: Pass database/stripe instances to services if possible, or use singletons for MVP simplicity (Standards recommend DI, but for this scale Singleton modules are acceptable if clean). **Decision**: Use exported singleton instances for simplicity in MVP.
-   **Error Handling**: Use `next(error)` in controllers to let global middleware handle it.
