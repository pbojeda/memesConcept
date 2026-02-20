import request from 'supertest';
import { app } from '../../src/app';
import { stripe } from '../../src/infrastructure/stripe';
import { Product } from '../../src/domain/models/Product';
import { Order } from '../../src/domain/models/Order';

// Mock everything
jest.mock('../../src/infrastructure/database', () => ({
    connectToDatabase: jest.fn(),
    disconnectFromDatabase: jest.fn(),
}));
jest.mock('../../src/domain/models/Product');
jest.mock('../../src/domain/models/Order');
jest.mock('../../src/infrastructure/stripe', () => ({
    stripe: {
        checkout: {
            sessions: {
                create: jest.fn()
            }
        }
    }
}));

describe('Checkout Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /checkout', () => {
        it('should create a checkout session and return clientSecret', async () => {
            const mockProduct = {
                _id: 'product-id',
                name: 'Test Product',
                variants: [{ size: 'M', color: 'Red', stock: 10 }],
                save: jest.fn()
            };
            (Product.findById as jest.Mock).mockResolvedValue(mockProduct);
            (Order.create as jest.Mock).mockResolvedValue({});

            // Mock Stripe response
            (stripe.checkout.sessions.create as jest.Mock).mockResolvedValue({
                client_secret: 'secret_123',
                id: 'sess_123'
            });

            const response = await request(app)
                .post('/checkout')
                .send({
                    productId: 'product-id',
                    quantity: 1,
                    variant: { size: 'M', color: 'Red' }
                });

            expect(response.status).toBe(200);
            expect(response.body.clientSecret).toBe('secret_123');
        });

        it('should return 400 for invalid input', async () => {
            const response = await request(app)
                .post('/checkout')
                .send({
                    // Missing productId
                    quantity: 1
                });

            expect(response.status).toBe(400);
        });

        it('should return 404 if product not found', async () => {
            (Product.findById as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .post('/checkout')
                .send({
                    productId: 'non-existent',
                    quantity: 1,
                    variant: { size: 'M', color: 'Red' }
                });

            expect(response.status).toBe(404);
        });
    });
});
