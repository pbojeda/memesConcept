
import { z } from 'zod';

export const ProductVariantSchema = z.object({
    size: z.string(),
    color: z.string(),
    stock: z.number().min(0)
});

const ProductBase = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price must be positive"),
    images: z.array(z.string()).optional().default([]),
    imageUrl: z.string().optional(),
    slug: z.string().optional(),
    variants: z.array(ProductVariantSchema).optional().default([]),
});

export const ProductSchema = ProductBase.extend({
    id: z.string(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});

export type Product = z.infer<typeof ProductSchema>;
export const CreateProductSchema = ProductBase;
export const UpdateProductSchema = ProductBase.partial();
