
import request from 'supertest';
import { app } from '../../src/app';
import { Product } from '../../src/domain/models/Product';
import { CloudinaryService } from '../../src/infrastructure/services/CloudinaryService';

// 1. Mock Database
jest.mock('../../src/infrastructure/database', () => ({
    connectToDatabase: jest.fn(),
    disconnectFromDatabase: jest.fn(),
}));

// 2. Mock Product Model
jest.mock('../../src/domain/models/Product');

// 3. Mock Cloudinary Service
jest.mock('../../src/infrastructure/services/CloudinaryService');

describe('Admin Product CRUD Integration', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.ADMIN_API_KEY = 'secret-key';
    });

    // ------------------------------------------------------------------
    // 1. Security (Middleware) Tests
    // ------------------------------------------------------------------
    describe('Security Middleware', () => {
        it('should return 401 if x-admin-key is missing', async () => {
            const response = await request(app).post('/admin/products');
            expect(response.status).toBe(401);
            // But since I haven't registered the routes in app.ts yet, this test will fail or return 404.
            // RED PHASE: It should fail (404 != 401).
        });

        // Test with invalid key
    });


    // ------------------------------------------------------------------
    // 2. Create Product (POST /admin/products)
    // ------------------------------------------------------------------
    describe('POST /admin/products', () => {
        it('should create a product successfully with valid key', async () => {
            const newProduct = {
                name: 'New Meme',
                price: 1500,
                description: 'Funny',
                slug: 'new-meme',
                images: ['http://res.cloudinary.com/demo/image/upload/sample.jpg']
            };

            // Mock Product.create
            (Product.create as jest.Mock).mockResolvedValue({ ...newProduct, _id: '123' });

            const response = await request(app)
                .post('/admin/products')
                .set('x-admin-key', 'secret-key')
                .send(newProduct);

            // Expect failure because route is not registered
            expect(response.status).toBe(201);
        });
    });

    // ------------------------------------------------------------------
    // 3. Update Product (PUT /admin/products/:id)
    // ------------------------------------------------------------------
    describe('PUT /admin/products/:id', () => {
        it('should update product', async () => {
            // Mock findByIdAndUpdate
            (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue({ name: 'Updated' });

            const response = await request(app)
                .put('/admin/products/123')
                .set('x-admin-key', 'secret-key')
                .send({ name: 'Updated' });

            expect(response.status).toBe(200);
        });
    });

    // ------------------------------------------------------------------
    // 4. Delete Product (DELETE /admin/products/:id)
    // ------------------------------------------------------------------
    describe('DELETE /admin/products/:id', () => {
        it('should delete product', async () => {
            // Mock findByIdAndDelete
            (Product.findByIdAndDelete as jest.Mock).mockResolvedValue({});

            const response = await request(app)
                .delete('/admin/products/123')
                .set('x-admin-key', 'secret-key');

            expect(response.status).toBe(204);
        });
    });

});
