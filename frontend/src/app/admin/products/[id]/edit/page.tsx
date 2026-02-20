
'use client';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/adminApi';
import { ProductForm } from '@/components/admin/ProductForm';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function EditProductPage() {
    const params = useParams();
    const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';

    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: () => adminApi.getProduct(id),
        enabled: !!id
    });

    if (!id) return <div>Invalid ID</div>;
    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    if (error || !product) return <div className="p-8 text-red-500">Error loading product or not found.</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
            <ProductForm initialData={product} isEdit />
        </div>
    );
}
