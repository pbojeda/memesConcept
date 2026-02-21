import { Product } from "../types";

const getBaseUrl = () => {
    let url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";
    // Remove trailing slash if user left it in the Vercel env vars
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    return url;
};

export const productService = {
    getAll: async (): Promise<Product[]> => {
        const url = `${getBaseUrl()}/products`;
        const res = await fetch(url, {
            signal: AbortSignal.timeout(8000), // Abort if backend hangs for 8s
            next: { revalidate: 0 }, // Do not aggressively cache to ensure fresh DB retry test goes green
        });
        if (!res.ok) throw new Error(`[productService] GET ${url} failed with status: ${res.status} ${res.statusText}`);
        return res.json();
    },

    getBySlugOrId: async (id: string): Promise<Product> => {
        const url = `${getBaseUrl()}/products/${id}`;
        const res = await fetch(url, {
            signal: AbortSignal.timeout(8000),
            next: { revalidate: 0 },
        });
        if (!res.ok) throw new Error(`[productService] GET ${url} failed with status: ${res.status} ${res.statusText}`);
        return res.json();
    },
};
