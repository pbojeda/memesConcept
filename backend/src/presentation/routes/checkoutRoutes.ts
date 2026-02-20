import { Router } from 'express';
import { checkoutController } from '../controllers/CheckoutController';

const router = Router();

router.post('/', checkoutController.createSession);

export { router as checkoutRouter };
