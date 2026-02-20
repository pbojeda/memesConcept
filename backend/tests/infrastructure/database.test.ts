import mongoose from 'mongoose';
import { connectToDatabase, disconnectFromDatabase } from '../../src/infrastructure/database';

jest.mock('mongoose', () => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
}));

// Mock config to avoid loading real env vars
jest.mock('../../src/infrastructure/config', () => ({
    config: {
        MONGO_URI: 'mongodb://localhost:27017/test',
    },
}));

describe('Database', () => {
    it('should connect to database', async () => {
        (mongoose.connect as jest.Mock).mockResolvedValue(true);
        await connectToDatabase();
        expect(mongoose.connect).toHaveBeenCalledWith('mongodb://localhost:27017/test');
    });

    it('should disconnect from database', async () => {
        (mongoose.disconnect as jest.Mock).mockResolvedValue(true);
        await disconnectFromDatabase();
        expect(mongoose.disconnect).toHaveBeenCalled();
    });
});
