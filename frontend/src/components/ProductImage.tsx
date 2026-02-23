"use client";

import Image from "next/image";
import { Product } from "@/schemas/product";
import { useState } from "react";

interface ProductImageProps {
    product: Product;
    alt?: string;
    className?: string;
}

export function ProductImage({ product, alt, className }: ProductImageProps) {
    const [imgSrc, setImgSrc] = useState(product.images?.[0] || product.imageUrl || '/placeholder.jpg');

    return (
        <Image
            src={imgSrc}
            alt={alt || product.name}
            className={className || "w-full h-full object-cover"}
            width={800}
            height={800}
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={() => {
                setImgSrc('/placeholder.jpg'); // Simple fallback to a local image
            }}
        />
    );
}
