import mongoose from 'mongoose';
import { config } from './config';

export const connectToDatabase = async (): Promise<void> => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        // We choose not to process.exit(1) here so the web server can still bind to the port
        // and allow Render/clouds to pass health-checks while you whitelist the IP in Atlas.
    }
};

export const disconnectFromDatabase = async (): Promise<void> => {
    await mongoose.disconnect();
};
