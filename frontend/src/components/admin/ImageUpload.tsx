
'use client';

import { useState } from 'react';
import { Input } from '../ui/input';

interface ImageUploadProps {
    onImageSelected: (base64: string) => void;
    currentImage?: string;
    hidePreview?: boolean;
}

export function ImageUpload({ onImageSelected, currentImage, hidePreview = false }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(currentImage || null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setPreview(result);
            onImageSelected(result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-2">
            {!hidePreview && preview && (
                <div className="mb-2">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded border"
                    />
                </div>
            )}
            <Input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
    );
}
