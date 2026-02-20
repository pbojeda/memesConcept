import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    variant?: {
        size: string;
        color: string;
    };
    stripeSessionId: string;
    status: 'pending' | 'paid' | 'failed';
    amountTotal?: number;
    customerDetails?: {
        email?: string;
        name?: string;
    };
}

const OrderSchema = new Schema<IOrder>({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    variant: {
        size: { type: String },
        color: { type: String },
    },
    stripeSessionId: { type: String, required: true, unique: true },
    status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    amountTotal: { type: Number },
    customerDetails: {
        email: { type: String },
        name: { type: String },
    },
}, {
    timestamps: true,
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
