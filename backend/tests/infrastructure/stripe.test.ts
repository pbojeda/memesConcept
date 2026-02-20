import { stripe } from '../../src/infrastructure/stripe';
import Stripe from 'stripe';

jest.mock('stripe');

// Mock config
jest.mock('../../src/infrastructure/config', () => ({
    config: {
        STRIPE_SECRET_KEY: 'sk_test_123',
    },
}));

describe('Stripe', () => {
    it('should initialize stripe with secret key', () => {
        // We need to require it to trigger the instantiation
        require('../../src/infrastructure/stripe');
        expect(Stripe).toHaveBeenCalledWith('sk_test_123', expect.objectContaining({
            apiVersion: '2026-01-28.clover',
        }));
    });
});
