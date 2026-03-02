import { z } from 'zod';

export const checkoutSchema = z.object({
    items: z.array(z.object({
        productId: z.string().min(1, 'Product ID is required'),
        quantity: z.number().int().min(1, 'Quantity must be at least 1'),
        variant: z.object({
            size: z.string().optional(),
            color: z.string().optional(),
        }).optional(),
    })).min(1, 'At least one item is required'),
});

export type CheckoutRequest = z.infer<typeof checkoutSchema>;
