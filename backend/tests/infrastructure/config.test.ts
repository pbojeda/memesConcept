
jest.mock('dotenv', () => ({
    config: jest.fn(),
}));


describe('Config', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('should validate correct environment variables', () => {
        process.env.PORT = '3000';
        process.env.MONGO_URI = 'mongodb://localhost:27017/test';
        process.env.STRIPE_SECRET_KEY = 'sk_test_123';
        process.env.STRIPE_WEBHOOK_SECRET = 'whsec_123';
        process.env.NODE_ENV = 'test';

        // We need to re-import strictly inside the test to trigger Zod parsing on import
        const { config: reloadedConfig } = require('../../src/infrastructure/config');

        expect(reloadedConfig.PORT).toBe(3000);
        expect(reloadedConfig.MONGO_URI).toBe('mongodb://localhost:27017/test');
        expect(reloadedConfig.STRIPE_SECRET_KEY).toBe('sk_test_123');
    });

    it('should throw error if required var is missing', () => {
        delete process.env.MONGO_URI;

        expect(() => {
            require('../../src/infrastructure/config');
        }).toThrow();
    });
});
