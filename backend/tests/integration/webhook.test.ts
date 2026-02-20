import request from 'supertest';
import { app } from '../../src/app';
import { stripe } from '../../src/infrastructure/stripe';
import { Order } from '../../src/domain/models/Order';

// Mock database
jest.mock('../../src/infrastructure/database', () => ({
    connectToDatabase: jest.fn(),
    disconnectFromDatabase: jest.fn(),
}));

// Mock Models
jest.mock('../../src/domain/models/Product');
jest.mock('../../src/domain/models/Order');

// Mock Stripe
jest.mock('../../src/infrastructure/stripe', () => ({
    stripe: {
        webhooks: {
            constructEvent: jest.fn()
        }
    }
}));

// Mock Config
jest.mock('../../src/infrastructure/config', () => ({
    config: {
        STRIPE_WEBHOOK_SECRET: 'whsec_test',
        PORT: 3000
    }
}));

describe('Webhook Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /webhook/stripe', () => {
        it('should handle checkout.session.completed', async () => {
            const mockEvent = {
                type: 'checkout.session.completed',
                data: {
                    object: {
                        id: 'sess_123',
                        amount_total: 2000,
                        customer_details: { email: 'test@example.com' }
                    }
                }
            };

            (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(mockEvent);
            (Order.findOneAndUpdate as jest.Mock).mockResolvedValue({});

            const response = await request(app)
                .post('/webhook/stripe')
                .set('stripe-signature', 'valid_signature')
                .send(Buffer.from(JSON.stringify(mockEvent)));

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ received: true });
            expect(Order.findOneAndUpdate).toHaveBeenCalledWith(
                { stripeSessionId: 'sess_123' },
                {
                    status: 'paid',
                    amountTotal: 2000,
                    customerDetails: { email: 'test@example.com' }
                }
            );
        });

        it('should return 400 for invalid signature', async () => {
            (stripe.webhooks.constructEvent as jest.Mock).mockImplementation(() => {
                throw new Error('Invalid signature');
            });

            const response = await request(app)
                .post('/webhook/stripe')
                .set('stripe-signature', 'invalid')
                .send('raw_payload');

            expect(response.status).toBe(400);
        });
    });
});
