import { productService } from "../../../services/product.service";
import { ProductDetailClient } from "../../../components/product/ProductDetailClient";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

import type { Metadata } from "next";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    try {
        const product = await productService.getBySlugOrId(slug);
        if (!product) return { title: "Product Not Found" };

        const mainImage = product.images?.[0] || product.imageUrl;

        return {
            title: product.name,
            description: product.description?.substring(0, 160) || `Buy ${product.name} at Memes Concept Store`,
            openGraph: {
                title: product.name,
                description: product.description?.substring(0, 160),
                images: mainImage ? [{ url: mainImage }] : [],
                type: "website",
            },
        };
    } catch {
        return { title: "Error" };
    }
}

import { PageViewTracker } from '@/components/Tracking';

export default async function ProductPage({ params }: PageProps) {
    const { slug } = await params;
    let product;
    try {
        product = await productService.getBySlugOrId(slug);
    } catch (error) {
        console.error("Failed to fetch product", error);
    }

    if (!product) {
        notFound();
    }

    return (
        <>
            <PageViewTracker eventType="view_product" productId={product.id} />
            <ProductDetailClient product={product} />
        </>
    );
}
