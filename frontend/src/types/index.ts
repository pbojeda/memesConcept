
export type { Product, ProductVariant, Order, OrderItem } from '@memes/shared';

export interface CheckoutSessionResponse {
    clientSecret: string;
    id: string;
}
