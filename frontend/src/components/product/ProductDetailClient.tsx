"use client";

import { useState } from "react";
import { Product, ProductVariant } from "../../types";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { VariantSelector } from "./VariantSelector";
import { BuyButton } from "../checkout/BuyButton";
import { EmbeddedCheckoutComponent } from "../checkout/EmbeddedCheckout";

interface ProductDetailClientProps {
    product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
        product.variants[0] || null
    );
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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

                    <div className="mt-10">
                        <BuyButton
                            productId={product.id}
                            selectedVariant={selectedVariant}
                            onCheckoutStart={setClientSecret}
                            disabled={product.variants?.some(v => v.size || v.color) ? !selectedVariant : false}
                        />
                    </div>
                </div>
            </div>

            {/* Checkout Modal */}
            {clientSecret && (
                <EmbeddedCheckoutComponent
                    clientSecret={clientSecret}
                    onClose={() => setClientSecret(null)}
                />
            )}
        </div>
    );
}
