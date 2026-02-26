
import axios from 'axios';
import { Product } from '@/schemas/product';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + '/admin/products',
    headers: {
        'Content-Type': 'application/json'
    }
});

import { getSession } from 'next-auth/react';

api.interceptors.request.use(async (config) => {
    const session = await getSession();
    // @ts-expect-error: Custom property injected
    const token = session?.backendToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
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

    createProduct: async (data: Partial<Product>) => {
        const response = await api.post<Product>('/', data);
        return response.data;
    },

    updateProduct: async (id: string, data: Partial<Product>) => {
        const response = await api.put<Product>(`/${id}`, data);
        return response.data;
    },

    deleteProduct: async (id: string) => {
        await api.delete(`/${id}`);
    },

    uploadImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('image', file);
        // We use native fetch to avoid axios overriding the boundary needed for multipart
        const session = await getSession();
        // @ts-expect-error: Custom property injected
        const token = session?.backendToken || '';

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products/upload`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to upload image');
        const data = await response.json();
        return data.url;
    },

    getAnalytics: async (filters?: { startDate?: string; endDate?: string; productId?: string }) => {
        // Because baseURL is set to /products, we have to override it or just use full path 
        // since baseURL works like string concatenation if not absolute. Let's just create a new config override.
        const response = await api.get('/admin/analytics', {
            baseURL: process.env.NEXT_PUBLIC_API_URL,
            params: filters
        });
        return response.data;
    }
};
