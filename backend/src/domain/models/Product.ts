
import mongoose, { Schema, Document } from 'mongoose';
import { Product as SharedProduct, ProductVariant as SharedProductVariant } from '@memes/shared';

// Interface extends Shared Type + Mongoose Document
export interface IProduct extends Document, Omit<SharedProduct, 'id'> {
    variants: SharedProductVariant[];
}

const ProductVariantSchema = new Schema<SharedProductVariant>({
    size: { type: String, required: true },
    color: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
}, { _id: false });

const ProductSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    slug: { type: String, required: true, unique: true },
    variants: [ProductVariantSchema],
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret: Record<string, any>) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
