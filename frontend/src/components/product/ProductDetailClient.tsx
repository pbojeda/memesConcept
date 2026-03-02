"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Product, ProductVariant } from "../../types";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { VariantSelector } from "./VariantSelector";
import { Button } from '@/components/ui/button';
import { QuantitySelector } from "./QuantitySelector";
import { useCartStore } from "@/store/cartStore";

interface ProductDetailClientProps {
    product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
        product.variants[0] || null
    );
    const [quantity, setQuantity] = useState(1);
    const { addItem } = useCartStore();

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to all memes
            </Link>

            <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
                {/* Gallery */}
                <ProductGallery
                    images={product.images?.length > 0 ? product.images : (product.imageUrl ? [product.imageUrl] : [])}
                    name={product.name}
                />

                {/* Info & Actions */}
                <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                    <ProductInfo product={product} />

                    <div className="mt-6">
                        <VariantSelector
                            variants={product.variants}
                            selectedVariant={selectedVariant}
                            onSelect={setSelectedVariant}
                        />
                    </div>

                    <div className="mt-10 flex flex-col space-y-4">
                        <div className="flex items-center space-x-4">
                            <span className="font-medium">Quantity:</span>
                            <QuantitySelector quantity={quantity} onChange={setQuantity} />
                        </div>
                        <Button
                            size="lg"
                            className="w-full text-lg py-6"
                            onClick={() => {
                                addItem(product, selectedVariant || undefined, quantity);
                            }}
                            disabled={product.variants?.some(v => v.size || v.color) ? !selectedVariant : false}
                            data-testid="add-to-cart-button"
                        >
                            Add to Cart
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
