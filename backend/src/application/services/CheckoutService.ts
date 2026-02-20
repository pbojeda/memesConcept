import { stripe } from '../../infrastructure/stripe';
import { config } from '../../infrastructure/config';
import { Product } from '../../domain/models/Product';
import { Order } from '../../domain/models/Order';
import { NotFoundError, ValidationError, AppError } from '../../domain/errors';
import { CheckoutRequest } from '../validators/checkoutValidator';

export class CheckoutService {
    async createCheckoutSession(data: CheckoutRequest) {
        const product = await Product.findById(data.productId);

        if (!product) {
            throw new NotFoundError('Product not found');
        }

        // Validate stock logic could go here (omitted for MVP simplicity)

        try {
            const variantLabel = [data.variant?.size, data.variant?.color].filter(Boolean).join(' - ');
            const displayDescription = variantLabel ? `Variant: ${variantLabel}` : undefined;
            const images = (product.images?.length > 0 ? product.images : (product.imageUrl ? [product.imageUrl] : []));

            // Create Stripe Session
            const session = await stripe.checkout.sessions.create({
                ui_mode: 'embedded',
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: product.name,
                                description: displayDescription,
                                images: images,
                                metadata: {
                                    productId: product.id,
                                    variant: JSON.stringify(data.variant)
                                }
                            },
                            unit_amount: Math.round(product.price * 100), // Stripe expects cents
                        },
                        quantity: data.quantity,
                    },
                ],
                mode: 'payment',
                shipping_address_collection: {
                    allowed_countries: ['US', 'CA', 'ES', 'GB', 'DE', 'FR'], // Adjust allowed countries as needed
                },
                return_url: `${config.FRONTEND_URL}/return?session_id={CHECKOUT_SESSION_ID}`,
            });

            // Create Order record (Pending)
            await Order.create({
                productId: product.id,
                quantity: data.quantity,
                variant: data.variant,
                stripeSessionId: session.id,
                status: 'pending',
                amountTotal: (product.price * 100) * data.quantity
            });

            return { clientSecret: session.client_secret, id: session.id };
        } catch (error) {
            console.error('Stripe Error:', error);
            throw new AppError('Failed to create checkout session', 500);
        }
    }
}

export const checkoutService = new CheckoutService();
