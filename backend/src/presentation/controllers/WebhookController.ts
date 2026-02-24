import { Request, Response } from 'express';
import { stripe } from '../../infrastructure/stripe';
import { config } from '../../infrastructure/config';
import { Order } from '../../domain/models/Order';
import { Product } from '../../domain/models/Product';
import { PrintfulService } from '../../infrastructure/services/PrintfulService';

export class WebhookController {
    async handleStripeWebhook(req: Request, res: Response): Promise<void> {
        const sig = req.headers['stripe-signature'];
        let event;

        try {
            if (!sig) throw new Error('No signature');

            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                config.STRIPE_WEBHOOK_SECRET
            );
        } catch (err: any) {
            console.error(`⚠️  Webhook signature verification failed.`, err.message);
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                // Cast event.data.object to Stripe Session type if needed, but for MVP implicit works or we can type it roughly
                const session = event.data.object as any;
                await WebhookController.handleCheckoutSessionCompleted(session);
                break;
            default:
            // Unexpected event type
            // console.log(`Unhandled event type ${event.type}`);
        }

        // Return a 200 response to acknowledge receipt of the event
        res.json({ received: true });
    }

    private static async handleCheckoutSessionCompleted(session: any) {
        // Update order status
        if (session.id) {
            const order = await Order.findOneAndUpdate(
                { stripeSessionId: session.id },
                {
                    status: 'paid',
                    amountTotal: session.amount_total,
                    customerDetails: session.customer_details
                },
                { new: true }
            );
            console.log(`✅ Order paid: ${session.id}`);

            if (order && order.status === 'paid' && session.customer_details?.address) {
                try {
                    // Recover Product Variant mapping
                    const product = await Product.findById(order.productId);
                    const selectedVariant = product?.variants.find(
                        (v) => v.size === order.variant?.size && v.color === order.variant?.color
                    );

                    // Map Stripe Customer details to Printful Order Format
                    const address = session.customer_details.address;
                    const pfOrder = await PrintfulService.createOrder({
                        external_id: order.id,
                        shipping: "STANDARD",
                        recipient: {
                            name: session.customer_details.name || "Customer",
                            address1: address.line1 || "",
                            address2: address.line2 || undefined,
                            city: address.city || "",
                            state_code: address.state || undefined,
                            country_code: address.country || "",
                            zip: address.postal_code || "",
                            email: session.customer_details.email || undefined,
                            phone: session.customer_details.phone || undefined,
                        },
                        items: [
                            {
                                // We use either the exact printful mapping if available, or a fallback (4012 = Basic T-Shirt) if MVP automated
                                sync_variant_id: selectedVariant?.printfulVariantId || 4012,
                                quantity: order.quantity,
                                retail_price: ((order.amountTotal || 0) / 100).toString()
                            }
                        ]
                    });

                    console.log(`🚀 Successfully Dispatched to Printful: ${pfOrder.id}`);

                } catch (pfError) {
                    console.error("❌ Printful Dispatch Failed:", pfError);
                    // Order is saved as Paid in our DB, we could trigger an alert email to Admin manually handle it
                }
            }
        }
    }
}

export const webhookController = new WebhookController();
