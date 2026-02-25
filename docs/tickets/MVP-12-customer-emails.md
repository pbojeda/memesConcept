# Customer Feature: Order Confirmation Emails

**Status**: PLANNED
**Priority**: MEDIUM
**Assignee**: @backend-planner

## Description
Customers need a receipt and confirmation of their purchase once the Stripe Webhook fires. Instead of building a complex email server, we should leverage existing tools (Stripe and/or Printful) or use a robust API strategy if deep customization is needed.

## Requirements
1. **Option A: Stripe Native (No Code)**:
   - Go to Stripe Dashboard > settings > "Customer Emails".
   - Toggle on "Send email receipts for successful payments".
   - *Pros*: Zero code required, professional standard layout.
   - *Cons*: Might not have specialized wording about "Printful production times" unless added to custom notes.
2. **Option B: Printful Native (Tracking & Fulfillment)**:
   - Printful can automatically send "Your order has shipped" emails directly to the customer if the customer email is sent via the Webhook API and Printful's own Store Settings are configured to brand the packing slips / emails.
3. **Option C: Custom Emails via Resend**:
   - Integrate an email API (e.g., `resend` + `react-email`) hooked cleanly into the `WebhookController` directly after generating the Printful Order.
   - *Pros*: 100% brand control (MemesConcept theme).

## Decision Required
- Decide whether to rely purely on Stripe/Printful dashboard switches (zero-code MVP strategy) or if a custom branded Node.js email function is strictly required for the brand launch.

## Acceptance Criteria
- Upon successful payment, the customer receives an email with their order summary or an ETA.
