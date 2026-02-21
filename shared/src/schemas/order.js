"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSchema = exports.OrderItemSchema = void 0;
const zod_1 = require("zod");
const product_1 = require("./product");
exports.OrderItemSchema = zod_1.z.object({
    productId: zod_1.z.string(),
    quantity: zod_1.z.number().int().positive(),
    variant: product_1.ProductVariantSchema.optional()
});
exports.OrderSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    stripeSessionId: zod_1.z.string(),
    amountTotal: zod_1.z.number(),
    status: zod_1.z.enum(['pending', 'paid', 'failed']),
    items: zod_1.z.array(exports.OrderItemSchema),
    customerEmail: zod_1.z.string().email().optional(),
    shippingAddress: zod_1.z.any().optional(), // Define strictly if needed
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional()
});
