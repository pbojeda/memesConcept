"use client";

import { Product } from "@/schemas/product";

interface ProductImageProps {
    product: Product;
    alt?: string;
    className?: string;
}

export function ProductImage({ product, alt, className }: ProductImageProps) {
    // Prioritize newer images array, fall back to legacy imageUrl
    const src = product.images?.[0] || product.imageUrl || '/placeholder-image.png'; // Add a placemolder eventually

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src}
            alt={alt || product.name}
            className={className}
            onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/400x400?text=No+Image'; // Simple fallback
            }}
        />
    );
}
