
import { z } from 'zod';
import { ProductVariantSchema } from './product';

export const OrderItemSchema = z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    variant: ProductVariantSchema.optional()
});

export const OrderSchema = z.object({
    id: z.string().optional(),
    stripeSessionId: z.string(),
    amountTotal: z.number(),
    status: z.enum(['pending', 'paid', 'failed']),
    items: z.array(OrderItemSchema),
    customerEmail: z.string().email().optional(),
    shippingAddress: z.any().optional(), // Define strictly if needed
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});

export type Order = z.infer<typeof OrderSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
