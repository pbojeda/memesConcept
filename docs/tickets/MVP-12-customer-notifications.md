# MVP-12: Customer Notifications

## Status
COMPLETED (via Native Integrations)

## Requirements
Send an automated order confirmation email to the customer once their payment is successfully processed via Stripe.

## Edge Cases & Improvements Identified
1. **Email Provider**: We need a reliable service. Since this is an MVP, we can use `Nodemailer` with an SMTP relay, or a modern API like `Resend` or `SendGrid`. `Resend` is highly recommended for Next.js/Node.js stacks due to its simplicity and generous free tier, or we can just use standard `nodemailer` with a Gmail app password for local/dev if the user prefers zero setup. Let's aim for `Nodemailer` + `Resend` API keys, but support standard SMTP.
2. **Trigger Point**: The email should be dispatched inside the Stripe `checkout.session.completed` webhook handler, right after the Order status is set to `paid`.
3. **Email Content**:
   - Subject: "Order Confirmation - MemesConcept"
   - Body: A clean HTML template thanking the customer, showing the Order ID, the list of items purchased (with quantities and prices), the shipping address, and the total amount paid.
   - We must ensure prices are displayed in Euros (€).
4. **Customer Email Address**: We will extract the customer's email from the Stripe session object (`session.customer_details.email`).
5. **Error Handling**: If sending the email fails, it should NOT crash the webhook or prevent the Printful order from being dispatched. It should fail gracefully, log the error, and potentially flag the order in the database for a manual retry later.

## Implementation Plan
**Update:** It has been decided that for the MVP phase, we will utilize the native transactional emails automatically sent by **Stripe** (payment receipts) and **Printful** (shipping/tracking updates) to the customer. 
No custom Nodemailer integration is required at this time. This ticket is considered resolved.
