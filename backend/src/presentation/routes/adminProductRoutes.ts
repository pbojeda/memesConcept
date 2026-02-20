
import { Router } from 'express';
import { AdminProductController } from '../controllers/AdminProductController';
import { adminAuth } from '../../middleware/adminAuth';
import { productController } from '../controllers/ProductController';

const router = Router();

router.use(adminAuth);

// Read operations (Protected by Admin Auth for consistency, though public exists)
router.get('/', productController.list.bind(productController));
router.get('/:id', productController.get.bind(productController));

// Write operations
router.post('/', AdminProductController.createProduct);
router.put('/:id', AdminProductController.updateProduct);
router.delete('/:id', AdminProductController.deleteProduct);

export default router;
