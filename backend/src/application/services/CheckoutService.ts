import { stripe } from '../../infrastructure/stripe';
import { config } from '../../infrastructure/config';
import { Product } from '../../domain/models/Product';
import { Order } from '../../domain/models/Order';
import { NotFoundError, ValidationError, AppError } from '../../domain/errors';
import { CheckoutRequest } from '../validators/checkoutValidator';

export class CheckoutService {
    async createCheckoutSession(data: CheckoutRequest) {
        const lineItems = [];
        const orderItems = [];
        let totalAmount = 0;

        for (const item of data.items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                throw new NotFoundError(`Product not found: ${item.productId}`);
            }

            const variantLabel = [item.variant?.size, item.variant?.color].filter(Boolean).join(' - ');
            const displayDescription = variantLabel ? `Variant: ${variantLabel}` : undefined;

            const rawImages = (product.images?.length > 0 ? product.images : (product.imageUrl ? [product.imageUrl] : []));
            const validImages = rawImages.filter(url =>
                url && typeof url === 'string' && url.length < 2000 && url.startsWith('http')
            );

            lineItems.push({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: product.name,
                        description: displayDescription,
                        images: validImages.length > 0 ? validImages : undefined,
                        metadata: {
                            productId: product.id,
                            variant: JSON.stringify(item.variant)
                        }
                    },
                    unit_amount: Math.round(product.price * 100),
                },
                quantity: item.quantity,
            });

            orderItems.push({
                productId: product.id,
                quantity: item.quantity,
                variant: item.variant,
            });

            totalAmount += (product.price * 100) * item.quantity;
        }

        try {
            const session = await stripe.checkout.sessions.create({
                ui_mode: 'embedded',
                line_items: lineItems,
                mode: 'payment',
                shipping_address_collection: {
                    allowed_countries: ['US', 'CA', 'ES', 'GB', 'DE', 'FR'],
                },
                return_url: data.returnUrl || `${config.FRONTEND_URL}/return?session_id={CHECKOUT_SESSION_ID}`,
            });

            await Order.create({
                items: orderItems,
                stripeSessionId: session.id,
                status: 'pending',
                amountTotal: totalAmount
            });

            return { clientSecret: session.client_secret, id: session.id };
        } catch (error) {
            throw new AppError('Failed to create checkout session', 500);
        }
    }

    async getSessionOrder(stripeSessionId: string) {
        const order = await Order.findOne({ stripeSessionId }).populate('items.productId');
        if (!order) {
            throw new NotFoundError('Order not found');
        }
        return {
            status: order.status,
            amountTotal: order.amountTotal,
            customerDetails: order.customerDetails,
            items: order.items.map((item: any) => ({
                productName: item.productId?.name,
                productImage: item.productId?.images?.[0] || item.productId?.imageUrl,
                quantity: item.quantity,
                variant: item.variant
            }))
        };
    }
}

export const checkoutService = new CheckoutService();
