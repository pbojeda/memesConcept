import { Router } from 'express';
import { checkoutController } from '../controllers/CheckoutController';

const router = Router();

router.post('/', checkoutController.createSession);
router.get('/session/:sessionId', checkoutController.getSessionOrder);

export { router as checkoutRouter };
