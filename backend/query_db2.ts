import mongoose from 'mongoose';
import { Product } from './src/domain/models/Product';
import { config } from './src/infrastructure/config';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        const product = await Product.findById("699d9e72f692ab2ae0956e58").lean();
        console.log("PRODUCT IN DB:", JSON.stringify(product, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}
run();
