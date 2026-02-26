import mongoose, { Schema, Document } from 'mongoose';

export interface ITrackingEvent extends Document {
    eventType: 'page_view' | 'view_product' | 'initiate_checkout';
    productId?: string; // Optional, only applicable for product-specific events
    source?: string; // Traffic source or referrer URL
    createdAt: Date;
}

const TrackingEventSchema = new Schema<ITrackingEvent>({
    eventType: {
        type: String,
        required: true,
        enum: ['page_view', 'view_product', 'initiate_checkout']
    },
    productId: { type: String }, // Storing as String to accommodate both ObjectId and Slugs easily if needed, or stick to ObjectId
    source: { type: String }
}, {
    timestamps: { createdAt: true, updatedAt: false }, // We only care when it happened
});

// Indexing for faster aggregation queries
TrackingEventSchema.index({ eventType: 1, createdAt: -1 });
TrackingEventSchema.index({ productId: 1, eventType: 1 });

export const TrackingEvent = mongoose.model<ITrackingEvent>('TrackingEvent', TrackingEventSchema);
