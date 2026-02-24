# Integration feature: Printful automation for Products & Orders

**Status**: PLANNED
**Priority**: CRITICAL
**Assignee**: @backend-developer & @backend-planner

## Description
The user wants an automated workflow to avoid recreating products manually in Printful. 
The system should use the Printful API to:
1. Automatically create a Sync Product and its Sync Variants in Printful when a product is created in our Admin Dashboard.
2. Persist the returned `printfulSyncProductId` and `printfulSyncVariantIds` into our database.
3. Upon receiving a successful Stripe Webhook (payment completed), immediately transmit the order details (shipping address + internal Printful IDs) to the Printful Orders API to begin fulfillment.

## User flow
1. Admin uploads meme image and creates product in Admin Dashboard.
2. Backend catches this request:
   a. Uploads image to Cloudinary (already implemented).
   b. Calls Printful API to create a `Sync Product`.
   c. Saves Printful's external IDs on our local `Product` & `ProductVariant` MongoDB items.
3. Customer buys item via Stripe Embedded Checkout.
4. Stripe fires webhook to `/webhook` endpoint.
5. Backend verifies payment, formats the shipping address, and fires request to Printful's `/orders` API.

## Impact Code
- Backend configurations: `config.ts` (`PRINTFUL_API_KEY`)
- `shared/` Types & Validation Schemas (`ProductSchema` adding `printfulSyncProductId`, `printfulVariantId`)
- Product Model (`models/Product.ts`)
- Printful Integration Service (`services/PrintfulService.ts`)
- Controllers updating: `AdminProductController.ts` & `WebhookController.ts`

## Success criteria
- Passing integration tests calling a mocked Printful API.
- End-to-end admin workflow locally.
- Mongoose schema validates the new optional external variants IDs.
