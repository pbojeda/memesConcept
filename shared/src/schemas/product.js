"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductSchema = exports.CreateProductSchema = exports.ProductSchema = exports.ProductVariantSchema = void 0;
const zod_1 = require("zod");
exports.ProductVariantSchema = zod_1.z.object({
    size: zod_1.z.string(),
    color: zod_1.z.string(),
    stock: zod_1.z.number().min(0)
});
// Base schema for common fields
const ProductBase = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    description: zod_1.z.string().min(1, "Description is required"),
    price: zod_1.z.number().min(0, "Price must be positive"),
    images: zod_1.z.array(zod_1.z.string()).optional().default([]),
    imageUrl: zod_1.z.string().optional(), // Legacy, backward compatibility
    slug: zod_1.z.string().optional(),
    variants: zod_1.z.array(exports.ProductVariantSchema).optional().default([]),
});
// Full Product (Output / DB Record) - includes ID and Timestamps
exports.ProductSchema = ProductBase.extend({
    id: zod_1.z.string(),
    createdAt: zod_1.z.date().optional(), // Optional because new objects might not have it yet
    updatedAt: zod_1.z.date().optional()
});
// For creation, ID is not required
exports.CreateProductSchema = ProductBase;
exports.UpdateProductSchema = ProductBase.partial();
