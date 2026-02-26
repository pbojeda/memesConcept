import Link from "next/link";
import { productService } from "../services/product.service";
import { ProductImage } from "./ProductImage";
import { Product } from "@/schemas/product";

export async function SimilarProducts({ currentProductId }: { currentProductId: string }) {
    let products: Product[] = [];
    try {
        const data = await productService.getAll();
        if (Array.isArray(data)) {
            // Filter out the current product and grab up to 4 random/latest ones
            products = data
                .filter(p => p.id !== currentProductId)
                .slice(0, 4);
        }
    } catch (e) {
        console.warn("Failed to fetch similar products", e);
    }

    if (products.length === 0) return null;

    return (
        <div className="mt-24 border-t border-gray-200 pt-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">You might also like...</h2>
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {products.map((product) => (
                    <Link key={product.id} href={`/products/${product.id}`} className="group relative">
                        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75 sm:aspect-[2/3] lg:aspect-square">
                            <ProductImage
                                product={product}
                                className="absolute inset-0 h-full w-full object-cover object-center"
                            />
                        </div>
                        <div className="mt-4 flex justify-between">
                            <div>
                                <h3 className="text-sm text-gray-700">
                                    <span aria-hidden="true" className="absolute inset-0" />
                                    {product.name}
                                </h3>
                            </div>
                            <p className="text-sm font-medium text-gray-900">${product.price}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
