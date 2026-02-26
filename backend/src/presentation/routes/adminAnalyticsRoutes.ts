import { Router } from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController';
import { adminAuth } from '../../middleware/adminAuth';

const router = Router();

// Apply admin auth directly to all these routes
router.use(adminAuth);

router.get('/', AnalyticsController.getStats);

export default router;
