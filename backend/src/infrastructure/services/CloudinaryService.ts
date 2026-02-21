
import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config';

// Configure Cloudinary
cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET
});

export class CloudinaryService {
    static uploadBuffer(buffer: Buffer): Promise<string> {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'memes-store/products' },
                (error, result) => {
                    if (error) return reject(error);
                    if (result) resolve(result.secure_url);
                }
            );
            stream.end(buffer);
        });
    }

    static async deleteImage(url: string): Promise<void> {
        try {
            // Extracts public ID from URL:
            // e.g., https://res.cloudinary.com/.../image/upload/v123.../memes-store/products/123.jpg -> memes-store/products/123
            const parts = url.split('/');
            const uploadIndex = parts.indexOf('upload');
            // If valid URL pattern from cloudinary:
            if (uploadIndex > -1) {
                // Drop prefix and the version number (e.g., 'v173...'), and also the file extension
                const publicIdWithExtension = parts.slice(uploadIndex + 2).join('/');
                const publicId = publicIdWithExtension.split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }
        } catch (error) {
            console.error('Error deleting image from Cloudinary', error);
        }
    }
}
