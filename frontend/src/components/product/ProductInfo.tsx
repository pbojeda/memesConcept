import { Product } from "../../types";

interface ProductInfoProps {
    product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
            <p className="text-2xl tracking-tight text-gray-900">${product.price.toFixed(2)}</p>

            <div className="mt-4 space-y-4">
                <p className="text-base text-gray-700">{product.description}</p>
            </div>
        </div>
    );
}
