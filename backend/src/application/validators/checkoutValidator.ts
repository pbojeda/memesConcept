import { z } from 'zod';

export const checkoutSchema = z.object({
    productId: z.string({ message: 'Product ID is required' }),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    variant: z.object({
        size: z.string().optional(),
        color: z.string().optional(),
    }).optional(),
});

export type CheckoutRequest = z.infer<typeof checkoutSchema>;
