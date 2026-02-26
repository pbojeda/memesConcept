import { Router } from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController';

const router = Router();

router.post('/track', AnalyticsController.track);

export default router;
