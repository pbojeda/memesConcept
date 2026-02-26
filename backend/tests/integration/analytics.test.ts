import request from 'supertest';
import { app } from '../../src/app';
import { Product } from '../../src/domain/models/Product';
import { Order } from '../../src/domain/models/Order';
import { TrackingEvent } from '../../src/domain/models/TrackingEvent';
import jwt from 'jsonwebtoken';
import { config } from '../../src/infrastructure/config';

// Mock DB
jest.mock('../../src/infrastructure/database', () => ({
    connectToDatabase: jest.fn(),
    disconnectFromDatabase: jest.fn(),
}));

jest.mock('../../src/domain/models/Product');
jest.mock('../../src/domain/models/Order');
jest.mock('../../src/domain/models/TrackingEvent');

describe('Analytics API', () => {
    let adminToken: string;

    beforeAll(() => {
        adminToken = jwt.sign({ role: 'admin' }, config.JWT_SECRET);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /analytics/track', () => {
        it('should track a valid page_view event', async () => {
            (TrackingEvent.create as jest.Mock).mockResolvedValue({});

            const response = await request(app)
                .post('/analytics/track')
                .send({
                    eventType: 'page_view',
                    productId: 'prod1',
                    source: 'test'
                });

            expect(response.status).toBe(200);
            expect(TrackingEvent.create).toHaveBeenCalledWith({
                eventType: 'page_view',
                productId: 'prod1',
                source: 'test'
            });
        });

        it('should return 400 for invalid eventType', async () => {
            const response = await request(app)
                .post('/analytics/track')
                .send({
                    eventType: 'invalid_event',
                });
            expect(response.status).toBe(400);
        });
    });

    describe('GET /admin/analytics', () => {
        it('should return 401 if unauthorized', async () => {
            const response = await request(app).get('/admin/analytics');
            expect(response.status).toBe(401);
        });

        it('should aggregate global stats correctly', async () => {
            // Mock Orders Aggregation
            (Order.aggregate as jest.Mock).mockResolvedValueOnce([
                { totalOrders: 2, totalRevenue: 7500 } // Call 1: Core aggregates
            ]).mockResolvedValueOnce([
                { productName: 'Meme Shirt A', salesCount: 2 } // Call 2: Top Products
            ]);

            // Mock Tracking Event counts
            (TrackingEvent.countDocuments as jest.Mock)
                .mockResolvedValueOnce(3) // pageViews
                .mockResolvedValueOnce(1) // initiate_checkout
                .mockResolvedValueOnce(0); // view_product - wait: there are no product overrides here

            // Mock Traffic Sources Aggregation
            (TrackingEvent.aggregate as jest.Mock).mockResolvedValueOnce([
                { source: 'google', visits: 2 },
                { source: 'direct', visits: 1 }
            ]);

            const response = await request(app)
                .get('/admin/analytics')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);

            // Expected transformations
            expect(response.body.totalOrders).toBe(2);
            expect(response.body.totalRevenue).toBe(75); // 7500 / 100

            // Funnel math (2 orders / 3 views * 100)
            expect(response.body.funnelMetrics.pageViews).toBe(3);
            expect(response.body.funnelMetrics.checkoutsInitiated).toBe(1);
            expect(response.body.funnelMetrics.purchasesCompleted).toBe(2);
            expect(response.body.funnelMetrics.conversionRate).toBe(66.67);

            // Lists
            expect(response.body.topProducts[0].productName).toBe('Meme Shirt A');
            expect(response.body.trafficSources[0].source).toBe('google');
        });
    });
});
