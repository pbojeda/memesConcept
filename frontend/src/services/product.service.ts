import { api } from "../lib/api";
import { Product } from "../types";

export const productService = {
    getAll: async (): Promise<Product[]> => {
        const { data } = await api.get<Product[]>("/products");
        return data;
    },

    getBySlugOrId: async (id: string): Promise<Product> => {
        const { data } = await api.get<Product>(`/products/${id}`);
        return data;
    },
};
