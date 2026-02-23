import Link from "next/link";
import { productService } from "../services/product.service";
import { ProductImage } from "../components/ProductImage";
import { Product } from "@/schemas/product";

export default async function HomePage() {
  // Fetch products to list them
  let products: Product[] = [];
  try {
    const data = await productService.getAll();
    if (Array.isArray(data)) {
      products = data;
    }
  } catch (e) {
    console.warn("Failed to fetch products on home (Backend offline?)", e);
    // Fallback to empty or mock if needed
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8">Featured Memes</h1>
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`} className="group">
            {/* ... */}

            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-200">
              <ProductImage
                product={product}
                className="absolute inset-0 h-full w-full object-cover object-center group-hover:opacity-75"
              />
            </div>
            <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">${product.price}</p>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20">
          <p>No products found. Start the backend and seed the database!</p>
        </div>
      )}
    </div>
  );
}
