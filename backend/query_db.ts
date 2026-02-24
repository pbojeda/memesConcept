import mongoose from 'mongoose';
import { Order } from './src/domain/models/Order';
import { Product } from './src/domain/models/Product';
import { config } from './src/infrastructure/config';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        const order = await Order.findOne({ status: 'paid' }).sort({ createdAt: -1 }).lean();
        console.log("LATEST ORDER:", JSON.stringify(order, null, 2));

        if (order && order.productId) {
            const product = await Product.findById(order.productId).lean();
            console.log("ASSOCIATED PRODUCT VARIANTS:", JSON.stringify(product?.variants, null, 2));
            console.log("SELECTED VARIANT (order.variant):", JSON.stringify(order.variant, null, 2));

            const selectedVariant = product?.variants?.find(
                (v) => v.size === order.variant?.size && v.color === order.variant?.color
            );

            console.log("DEBUG SELECTED:", selectedVariant);
        }
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}
run();
