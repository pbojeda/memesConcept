import { Product, IProduct } from '../../domain/models/Product';
import { NotFoundError } from '../../domain/errors';

export class ProductService {
    async getAllProducts(): Promise<IProduct[]> {
        return await Product.find().sort({ createdAt: -1 });
    }

    async getProductBySlugOrId(identifier: string): Promise<IProduct> {
        let product;

        // Check if identifier is a valid ObjectId
        if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findById(identifier);
        } else {
            product = await Product.findOne({ slug: identifier });
        }

        if (!product) {
            throw new NotFoundError(`Product not found with identifier: ${identifier}`);
        }

        return product;
    }
}

export const productService = new ProductService();
