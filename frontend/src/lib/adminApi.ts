
import axios from 'axios';
import { Product } from '@/schemas/product';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + '/admin/products',
    headers: {
        'Content-Type': 'application/json',
        'x-admin-key': process.env.NEXT_PUBLIC_ADMIN_API_KEY
    }
});

export const adminApi = {
    getProducts: async () => {
        const response = await api.get<Product[]>('/');
        return response.data;
    },

    getProduct: async (id: string) => {
        const response = await api.get<Product>(`/${id}`);
        return response.data;
    },

    createProduct: async (data: any) => {
        const response = await api.post<Product>('/', data);
        return response.data;
    },

    updateProduct: async (id: string, data: any) => {
        const response = await api.put<Product>(`/${id}`, data);
        return response.data;
    },

    deleteProduct: async (id: string) => {
        await api.delete(`/${id}`);
    }
};
