import mongoose from 'mongoose';
import { config } from './config';

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

export const connectToDatabase = async (attempt = 1): Promise<void> => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log(`✅ Connected to MongoDB (Attempt ${attempt})`);
    } catch (error) {
        if (attempt < MAX_RETRIES) {
            console.error(`⚠️ MongoDB connection failed. Retrying in ${RETRY_DELAY / 1000} seconds... (Attempt ${attempt}/${MAX_RETRIES})`);
            await new Promise(res => setTimeout(res, RETRY_DELAY));
            return connectToDatabase(attempt + 1);
        } else {
            console.error(`❌ Exhausted all MongoDB connection retries (${MAX_RETRIES}). Database will remain offline.`);
            // We choose not to process.exit(1) here so the web server can still bind to the port
            // and allow Render/clouds to pass health-checks while you whitelist the IP in Atlas.
        }
    }
};

export const disconnectFromDatabase = async (): Promise<void> => {
    await mongoose.disconnect();
};
