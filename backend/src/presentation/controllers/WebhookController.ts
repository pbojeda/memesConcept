import { Request, Response } from 'express';
import { stripe } from '../../infrastructure/stripe';
import { config } from '../../infrastructure/config';
import { Order } from '../../domain/models/Order';

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
            await Order.findOneAndUpdate(
                { stripeSessionId: session.id },
                {
                    status: 'paid',
                    amountTotal: session.amount_total,
                    customerDetails: session.customer_details
                }
            );
            console.log(`✅ Order paid: ${session.id}`);
        }
    }
}

export const webhookController = new WebhookController();
