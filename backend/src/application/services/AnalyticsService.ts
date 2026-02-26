import { Order } from '../../domain/models/Order';
import { TrackingEvent } from '../../domain/models/TrackingEvent';
import { Product } from '../../domain/models/Product';
import mongoose from 'mongoose';

interface AnalyticsFilters {
    startDate?: string;
    endDate?: string;
    productId?: string;
}

export class AnalyticsService {
    static async trackEvent(eventType: string, productId?: string, source?: string): Promise<void> {
        await TrackingEvent.create({ eventType, productId, source });
    }

    static async getDashboardStats(filters: AnalyticsFilters) {
        // Construct standard match object based on dates
        const dateMatch: any = {};
        if (filters.startDate) dateMatch.$gte = new Date(filters.startDate);
        if (filters.endDate) dateMatch.$lte = new Date(filters.endDate);

        const timestampMatch = Object.keys(dateMatch).length > 0 ? { createdAt: dateMatch } : {};

        // Product specific match for tracking orders AND events
        const TrackingMatch: any = { ...timestampMatch };
        const OrderMatch: any = { ...timestampMatch, status: 'paid' };

        if (filters.productId) {
            TrackingMatch.productId = filters.productId;
            OrderMatch.productId = new mongoose.Types.ObjectId(filters.productId);
        }

        // 1. Core Order Aggregations (Revenue, Total Orders)
        const orderAggregates = await Order.aggregate([
            { $match: OrderMatch },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$amountTotal' }
                }
            }
        ]);

        const totalOrders = orderAggregates[0]?.totalOrders || 0;
        // Stripe sends cents, convert back to float
        const totalRevenue = orderAggregates[0]?.totalRevenue ? (orderAggregates[0].totalRevenue / 100) : 0;

        // 2. Top Products
        let topProducts: any[] = [];
        if (!filters.productId) { // Only calculate "top products" if we aren't filtering to 1 product
            topProducts = await Order.aggregate([
                { $match: OrderMatch },
                {
                    $group: {
                        _id: '$productId',
                        salesCount: { $sum: 1 }
                    }
                },
                { $sort: { salesCount: -1 } },
                { $limit: 5 },
                {
                    $lookup: {
                        from: 'products',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                { $unwind: '$product' },
                {
                    $project: {
                        _id: 0,
                        productName: '$product.name',
                        salesCount: 1
                    }
                }
            ]);
        }

        // 3. Funnel Metrics (Tracking Events vs Paid Orders)
        const pageViews = await TrackingEvent.countDocuments({ ...TrackingMatch, eventType: 'page_view' });
        const checkoutsInitiated = await TrackingEvent.countDocuments({ ...TrackingMatch, eventType: 'initiate_checkout' });
        const view_product = await TrackingEvent.countDocuments({ ...TrackingMatch, eventType: 'view_product' });

        // Sum total views (page limits mostly view_product for conversions)
        const totalViews = filters.productId ? view_product : pageViews;

        let conversionRate = 0;
        if (totalViews > 0) {
            conversionRate = parseFloat(((totalOrders / totalViews) * 100).toFixed(2));
        }

        const funnelMetrics = {
            pageViews: totalViews,
            checkoutsInitiated,
            purchasesCompleted: totalOrders,
            conversionRate
        };

        // 4. Traffic Sources
        const trafficSources = await TrackingEvent.aggregate([
            { $match: { ...TrackingMatch, source: { $exists: true, $ne: '' } } },
            {
                $group: {
                    _id: '$source',
                    visits: { $sum: 1 }
                }
            },
            { $sort: { visits: -1 } },
            { $limit: 5 },
            {
                $project: {
                    _id: 0,
                    source: '$_id',
                    visits: 1
                }
            }
        ]);

        return {
            totalRevenue,
            totalOrders,
            topProducts,
            funnelMetrics,
            trafficSources
        };
    }
}
