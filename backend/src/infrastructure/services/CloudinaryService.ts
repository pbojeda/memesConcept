
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
}
