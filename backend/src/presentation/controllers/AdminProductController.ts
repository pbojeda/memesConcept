
import { Request, Response } from 'express';
import { Product } from '../../domain/models/Product';
import { z } from 'zod';
import { CloudinaryService } from '../../infrastructure/services/CloudinaryService';
import { ProductSchema, CreateProductSchema } from '@memes/shared';

export class AdminProductController {
    static async createProduct(req: Request, res: Response) {
        try {
            // Use Shared Schema for validation
            const data = CreateProductSchema.parse(req.body);

            let images = data.images || [];
            if (data.imageUrl && images.length === 0) {
                images.push(data.imageUrl);
            }

            const product = await Product.create({
                ...data,
                images
            });
            res.status(201).json(product);
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ errors: error.issues });
            } else {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    }

    static async updateProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            // Use Partial schema from shared
            const updateSchema = ProductSchema.partial();
            const data = updateSchema.parse(req.body);

            let updateData: any = { ...data };
            if (data.imageUrl && (!data.images || data.images.length === 0)) {
                updateData.images = [data.imageUrl];
                delete updateData.imageUrl;
            }

            const product = await Product.findByIdAndUpdate(id, updateData, { new: true });

            if (!product) {
                res.status(404).json({ error: 'Product not found' });
                return;
            }

            res.status(200).json(product);
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ errors: error.issues });
            } else {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    }

    static async deleteProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const product = await Product.findByIdAndDelete(id);
            if (!product) {
                res.status(404).json({ error: 'Product not found' });
                return;
            }
            res.sendStatus(204);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async uploadImage(req: Request, res: Response) {
        try {
            if (!req.file) {
                res.status(400).json({ error: 'Image file is required' });
                return;
            }
            const url = await CloudinaryService.uploadBuffer(req.file.buffer);
            res.status(200).json({ url });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Upload Failed' });
        }
    }
}
