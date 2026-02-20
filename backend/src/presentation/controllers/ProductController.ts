import { Request, Response, NextFunction } from 'express';
import { productService } from '../../application/services/ProductService';

export class ProductController {
    async list(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const products = await productService.getAllProducts();
            res.json(products);
        } catch (error) {
            next(error);
        }
    }

    async get(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const product = await productService.getProductBySlugOrId(id as string);
            res.json(product);
        } catch (error) {
            next(error);
        }
    }
}

export const productController = new ProductController();
