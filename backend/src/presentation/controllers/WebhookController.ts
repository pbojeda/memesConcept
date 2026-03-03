import { Request, Response } from 'express';
import { stripe } from '../../infrastructure/stripe';
import { config } from '../../infrastructure/config';
import { Order } from '../../domain/models/Order';
import { Product } from '../../domain/models/Product';
import { PrintfulService } from '../../infrastructure/services/PrintfulService';
import { logger } from '../../app';

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
            logger.warn({ err }, `⚠️  Webhook signature verification failed.`);
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

        // Handle the event
        logger.info(`🔔 Received Stripe Webhook Event: ${event.type}`);
        switch (event.type) {
            case 'checkout.session.completed':
                // Cast event.data.object to Stripe Session type if needed, but for MVP implicit works or we can type it roughly
                const session = event.data.object as any;
                await WebhookController.handleCheckoutSessionCompleted(session);
                break;
            default:
                logger.info(`🤷‍♂️ Unhandled Stripe event type: ${event.type}`);
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
            logger.info(`✅ Order paid: ${session.id}`);

            if (order && order.status === 'paid' && session.customer_details?.address) {
                try {
                    const pfItems = [];
                    for (const item of order.items) {
                        const product = await Product.findById(item.productId);
                        if (!product) {
                            logger.warn(`Item in order ${order.id} has no product found. Skip.`);
                            continue;
                        }
                        const selectedVariant = product.variants.find(
                            (v) => v.size === item.variant?.size && v.color === item.variant?.color
                        );

                        if (selectedVariant?.printfulVariantId) {
                            pfItems.push({
                                sync_variant_id: selectedVariant.printfulVariantId,
                                quantity: item.quantity,
                                retail_price: product!.price.toString()
                            });
                        } else {
                            logger.warn(`Item in order ${order.id} has no Printful sync_variant_id mapped.`);
                        }
                    }

                    if (pfItems.length === 0) {
                        logger.warn(`Order ${order.id} paid but no Printful items mapped. Needs manual fulfillment.`);
                        return;
                    }

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
                        items: pfItems
                    });

                    logger.info(`🚀 Successfully Dispatched to Printful: ${pfOrder.id}`);

                } catch (pfError) {
                    logger.error({ err: pfError }, "❌ Printful Dispatch Failed");
                    // Order is saved as Paid in our DB, we could trigger an alert email to Admin manually handle it
                }
            }
        }
    }
}

export const webhookController = new WebhookController();
