
import { Router } from 'express';
import { AdminProductController } from '../controllers/AdminProductController';
import { adminAuth } from '../../middleware/adminAuth';
import { productController } from '../controllers/ProductController';

const router = Router();

router.use(adminAuth);

// Read operations (Protected by Admin Auth for consistency, though public exists)
router.get('/', productController.list.bind(productController));
router.get('/:id', productController.get.bind(productController));

import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

// Use memory storage for buffer-based cloudinary upload
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        // Enforce exact image mimetypes to prevent malicious files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed.'));
        }
    }
});

// Middleware to gracefully intercept Multer errors and respond with correct HTTP codes
const handleUpload = (req: Request, res: Response, next: NextFunction) => {
    const uploadSingle = upload.single('image');
    uploadSingle(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading (e.g. Too Large)
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'File is too large, maximum allowed is 5MB' });
            }
            return res.status(400).json({ error: err.message });
        } else if (err) {
            // An unknown error occurred (like our custom fileFilter throw)
            return res.status(400).json({ error: err.message });
        }
        // Everything went fine
        next();
    });
};

// Write operations
router.post('/', AdminProductController.createProduct);
router.put('/:id', AdminProductController.updateProduct);
router.delete('/:id', AdminProductController.deleteProduct);

// Multipart API Endpoint for Image Uploading
router.post('/upload', handleUpload, AdminProductController.uploadImage);

export default router;
