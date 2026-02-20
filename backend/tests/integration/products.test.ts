import request from 'supertest';
import { app } from '../../src/app';
import { Product } from '../../src/domain/models/Product';
import mongoose from 'mongoose';

// Mock mongoose connect/disconnect
jest.mock('../../src/infrastructure/database', () => ({
    connectToDatabase: jest.fn(),
    disconnectFromDatabase: jest.fn(),
}));

// Mock Product model
jest.mock('../../src/domain/models/Product');

describe('Product Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /products', () => {
        it('should return 200 and a list of products', async () => {
            const mockProducts = [
                { name: 'Meme 1', slug: 'meme-1', price: 1000 },
                { name: 'Meme 2', slug: 'meme-2', price: 2000 },
            ];

            // Mock Mongoose find with sort chain
            const mockQuery = {
                sort: jest.fn().mockResolvedValue(mockProducts)
            };
            (Product.find as jest.Mock).mockReturnValue(mockQuery);

            const response = await request(app).get('/products');

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            expect(response.body[0].name).toBe('Meme 1');
        });
    });

    describe('GET /products/:id', () => {
        it('should return 200 for valid ID', async () => {
            const mockProduct = { name: 'Meme 1', slug: 'meme-1', price: 1000 };
            (Product.findOne as jest.Mock).mockResolvedValue(mockProduct);

            const response = await request(app).get('/products/meme-1');

            expect(response.status).toBe(200);
            expect(response.body.name).toBe('Meme 1');
        });

        it('should return 404 if product not found', async () => {
            (Product.findOne as jest.Mock).mockResolvedValue(null);

            const response = await request(app).get('/products/non-existent');

            expect(response.status).toBe(404);
        });
    });
});
