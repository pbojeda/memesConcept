import { Request, Response } from 'express';
import { Product } from '../../domain/models/Product';
import { z } from 'zod';
import { CloudinaryService } from '../../infrastructure/services/CloudinaryService';
import { PrintfulService } from '../../infrastructure/services/PrintfulService';
import { ProductSchema, CreateProductSchema } from '@memes/shared';
import { logger } from '../../app';

export class AdminProductController {
    static async createProduct(req: Request, res: Response) {
        try {
            // Use Shared Schema for validation
            const data = CreateProductSchema.parse(req.body);

            let images = data.images || [];
            if (data.imageUrl && images.length === 0) {
                images.push(data.imageUrl);
            }

            let printfulSyncProductId: number | undefined;
            const updatedVariants = [...(data.variants || [])];

            try {
                // Determine a basic variant to map to Printful for MVP if user provided no advanced mapping yet
                // Realistically, you'd map our generic sizes (M, L) to Printful's Catalog Variant IDs (e.g. 4012 for Bella+Canvas M Black)
                // For MVP automation, we will map them directly with placeholders if no specific mapping is selected from frontend.
                const pfProduct = await PrintfulService.createSyncProduct({
                    sync_product: {
                        name: data.name,
                        thumbnail: images[0]
                    },
                    sync_variants: updatedVariants.map((v, i) => ({
                        // Hardcoded placeholder logic: Maps our variant to a random Printful T-Shirt Catalog ID for MVP presentation
                        // Example Printful catalog ID: 4012 (Unisex Basic Softstyle T-Shirt - Black - L)
                        variant_id: 4012 + i,
                        retail_price: data.price.toString(),
                        files: [{ url: images[0] || 'https://placehold.co/400' }]
                    }))
                });

                if (pfProduct && pfProduct.id) {
                    printfulSyncProductId = pfProduct.id;
                    const pfFullProduct = await PrintfulService.getSyncProduct(pfProduct.id);
                    if (pfFullProduct && pfFullProduct.sync_variants) {
                        pfFullProduct.sync_variants.forEach((pfVar: any, i: number) => {
                            if (updatedVariants[i]) {
                                updatedVariants[i] = { ...updatedVariants[i], printfulVariantId: pfVar.id };
                            }
                        });
                    }
                }
            } catch (pfError) {
                logger.warn({ err: pfError }, "Printful sync failed, continuing without linking");
                // We choose to continue and create the local product even if Printful sync fails for MVP resilience.
            }

            const product = await Product.create({
                ...data,
                images,
                printfulSyncProductId,
                variants: updatedVariants
            });
            res.status(201).json(product);
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ errors: error.issues });
            } else {
                logger.error({ err: error }, 'Internal Server Error in createProduct');
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

            if (product.printfulSyncProductId && (updateData.name || updateData.images)) {
                try {
                    await PrintfulService.updateSyncProduct(product.printfulSyncProductId, {
                        sync_product: {
                            name: product.name,
                            thumbnail: product.images?.[0]
                        }
                    });
                    logger.info(`Updated associated Printful Sync Product: ${product.printfulSyncProductId}`);
                } catch (pfError) {
                    logger.warn({ err: pfError }, "Failed to update Sync Product in Printful, ignoring.");
                }
            }

            res.status(200).json(product);
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ errors: error.issues });
            } else {
                logger.error({ err: error }, 'Internal Server Error in updateProduct');
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

            if (product.printfulSyncProductId) {
                try {
                    await PrintfulService.deleteSyncProduct(product.printfulSyncProductId);
                    logger.info(`Deleted associated Printful Sync Product: ${product.printfulSyncProductId}`);
                } catch (pfError) {
                    logger.warn({ err: pfError }, "Failed to delete from Printful, ignoring.");
                }
            }

            // Cleanup orphaned images
            const imagesToDelete = product.images && product.images.length > 0 ? product.images : (product.imageUrl ? [product.imageUrl] : []);
            for (const url of imagesToDelete) {
                await CloudinaryService.deleteImage(url);
            }

            res.sendStatus(204);
        } catch (error) {
            logger.error({ err: error }, 'Internal Server Error in deleteProduct');
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
            logger.error({ err: error }, 'Upload Failed in uploadImage');
            res.status(500).json({ error: 'Upload Failed' });
        }
    }
}
