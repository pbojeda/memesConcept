
import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config';

// Configure Cloudinary
cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET
});

export class CloudinaryService {
    static async uploadImage(imagePath: string): Promise<string> {
        const result = await cloudinary.uploader.upload(imagePath, {
            folder: 'memes-store/products'
        });
        return result.secure_url;
    }

    static async uploadBase64(base64String: string): Promise<string> {
        const result = await cloudinary.uploader.upload(base64String, {
            folder: 'memes-store/products'
        });
        return result.secure_url;
    }
}
