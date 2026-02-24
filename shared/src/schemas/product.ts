
import { z } from 'zod';

export const ProductVariantSchema = z.object({
    size: z.string(),
    color: z.string(),
    stock: z.number().min(0),
    printfulVariantId: z.number().optional() // Maps directly to Printful's Sync Variant ID
});

// Base schema for common fields
const ProductBase = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price must be positive"),
    images: z.array(z.string().url("Must be a valid URL").max(2000, "URL too long")).optional().default([]),
    imageUrl: z.string().url("Must be a valid URL").max(2000, "URL too long").optional(), // Legacy, backward compatibility
    slug: z.string().optional(),
    variants: z.array(ProductVariantSchema).optional().default([]),
    printfulSyncProductId: z.number().optional(), // Maps directly to Printful's Sync Product ID
});

// Full Product (Output / DB Record) - includes ID and Timestamps
export const ProductSchema = ProductBase.extend({
    id: z.string(),
    createdAt: z.date().optional(), // Optional because new objects might not have it yet
    updatedAt: z.date().optional()
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductVariant = z.infer<typeof ProductVariantSchema>;

// For creation, ID is not required
export const CreateProductSchema = ProductBase;
export const UpdateProductSchema = ProductBase.partial();
