import { Request, Response } from 'express';
import { AnalyticsService } from '../../application/services/AnalyticsService';
import { logger } from '../../app';

export class AnalyticsController {
    static async track(req: Request, res: Response): Promise<void> {
        try {
            const { eventType, productId, source } = req.body;

            // Simple validation
            if (!['page_view', 'view_product', 'initiate_checkout'].includes(eventType)) {
                res.status(400).json({ error: 'Invalid eventType' });
                return;
            }

            // Non-blocking fire and forget tracking
            AnalyticsService.trackEvent(eventType, productId, source).catch(e => {
                logger.error({ err: e }, "Failed to track analytics event");
            });

            res.status(200).json({ message: 'Event tracked' });
        } catch (e) {
            logger.error({ err: e }, 'Tracking error');
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async getStats(req: Request, res: Response): Promise<void> {
        try {
            const filters = {
                startDate: req.query.startDate as string,
                endDate: req.query.endDate as string,
                productId: req.query.productId as string
            };

            const stats = await AnalyticsService.getDashboardStats(filters);
            res.status(200).json(stats);
        } catch (e) {
            logger.error({ err: e }, 'Analytics Stats error');
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
