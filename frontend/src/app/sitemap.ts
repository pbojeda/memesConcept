import { MetadataRoute } from "next";
import { productService } from "../services/product.service";
import { Product } from "../types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    let products: Product[] = [];
    try {
        // If DB is down, this might fail. We wrap in try-catch to allow build to succeed.
        products = await productService.getAll();
    } catch (error) {
        console.warn("Sitemap: Failed to fetch products, using fallback static routes only.", error);
    }

    const productUrls = (products || []).map((product) => ({
        url: `${baseUrl}/products/${product.slug || product.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        ...productUrls,
    ];
}
