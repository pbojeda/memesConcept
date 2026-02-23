
'use client';

import { useState } from 'react';
import { Input } from '../ui/input';

interface ImageUploadProps {
    onImageSelected: (base64: string) => void;
    currentImage?: string;
    hidePreview?: boolean;
    onUploadStart?: () => void;
    onUploadEnd?: () => void;
}

export function ImageUpload({ onImageSelected, currentImage, hidePreview = false, onUploadStart, onUploadEnd }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(currentImage || null);

    const [loading, setLoading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Optimistic local preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Actual upload
        try {
            setLoading(true);
            onUploadStart?.();
            const { adminApi } = await import('../../lib/adminApi');
            const url = await adminApi.uploadImage(file);
            onImageSelected(url);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload image. Please try again.");
            setPreview(null);
        } finally {
            setLoading(false);
            onUploadEnd?.();
        }
    };

    return (
        <div className="space-y-2">
            {!hidePreview && preview && (
                <div className="mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={preview}
                        alt="Preview"
                        className={`w-20 h-20 object-cover rounded border ${loading ? 'opacity-50' : ''}`}
                    />
                </div>
            )}
            <Input type="file" accept="image/*" onChange={handleFileChange} disabled={loading} />
            {loading && <p className="text-sm text-gray-500 animate-pulse">Uploading to Cloudinary...</p>}
        </div>
    );
}
