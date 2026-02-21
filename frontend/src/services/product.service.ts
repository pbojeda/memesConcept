import { Product } from "../types";

const getBaseUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";
};

export const productService = {
    getAll: async (): Promise<Product[]> => {
        const res = await fetch(`${getBaseUrl()}/products`, {
            signal: AbortSignal.timeout(8000), // Abort if backend hangs for 8s
            next: { revalidate: 0 }, // Do not aggressively cache to ensure fresh DB retry test goes green
        });
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
    },

    getBySlugOrId: async (id: string): Promise<Product> => {
        const res = await fetch(`${getBaseUrl()}/products/${id}`, {
            signal: AbortSignal.timeout(8000),
            next: { revalidate: 0 },
        });
        if (!res.ok) throw new Error("Failed to fetch product");
        return res.json();
    },
};
