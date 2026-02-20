import { Router } from 'express';
import { productController } from '../controllers/ProductController';

const router = Router();

router.get('/', productController.list);
router.get('/:id', productController.get);

export { router as productRouter };
