import mongoose from 'mongoose';
import { config } from './config';

export const connectToDatabase = async (): Promise<void> => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

export const disconnectFromDatabase = async (): Promise<void> => {
    await mongoose.disconnect();
};
