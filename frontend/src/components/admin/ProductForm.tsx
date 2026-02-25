
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateProductSchema, type Product } from '@/schemas/product';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { ImageUpload } from './ImageUpload';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import { Trash2, Plus } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export function ProductForm({ initialData, isEdit = false }: { initialData?: Product; isEdit?: boolean }) {
    const router = useRouter();
    const queryClient = useQueryClient(); // Add queryClient hook
    const [isLoading, setIsLoading] = useState(false);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm({
        resolver: zodResolver(CreateProductSchema),
        defaultValues: {
            name: initialData?.name || '',
            price: initialData?.price || 0,
            description: initialData?.description || '',
            slug: initialData?.slug || '',
            images: initialData?.images || [],
            variants: initialData?.variants?.length ? initialData.variants : (isEdit ? [] : [
                { size: 'S', color: 'White', stock: 100 },
                { size: 'M', color: 'White', stock: 100 },
                { size: 'L', color: 'White', stock: 100 },
                { size: 'XL', color: 'White', stock: 100 }
            ])
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "variants" as const
    });

    const onSubmit = async (data: Partial<Product>) => {
        setIsLoading(true);
        setError(null);

        // Auto-generate slug if empty
        if (!data.slug) {
            data.slug = (data.name || "")
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');
        }

        try {
            if (isEdit && initialData?.id) {
                await adminApi.updateProduct(initialData.id, data);
            } else {
                await adminApi.createProduct(data);
            }

            // Invalidate cache to force reload on list page and edit page
            await queryClient.invalidateQueries({ queryKey: ['products'] });
            if (isEdit && initialData?.id) {
                await queryClient.invalidateQueries({ queryKey: ['product', initialData.id] });
            }

            router.push('/admin/products');
            router.refresh();
        } catch (err: unknown) {
            console.error(err);
            const e = err as { response?: { data?: { message?: string } }, message?: string };
            setError(e.response?.data?.message || e.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageSelected = (base64: string) => {
        const currentImages = form.getValues('images') || [];
        form.setValue('images', [base64, ...currentImages]);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-white p-6 rounded-lg shadow">
            {error && <div className="text-red-500 bg-red-50 p-2 rounded">{error}</div>}

            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...form.register('name')} placeholder="Product Name" />
                {form.formState.errors.name && <p className="text-red-500 text-sm">{form.formState.errors.name?.message as string}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="slug">Slug (Optional - Auto-generated)</Label>
                <Input id="slug" {...form.register('slug')} placeholder="product-slug" />
                {form.formState.errors.slug && <p className="text-red-500 text-sm">{form.formState.errors.slug?.message as string}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...form.register('price', { valueAsNumber: true })}
                    placeholder="0.00"
                />
                {form.formState.errors.price && <p className="text-red-500 text-sm">{form.formState.errors.price?.message as string}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...form.register('description')} placeholder="Product details..." />
                {form.formState.errors.description && <p className="text-red-500 text-sm">{form.formState.errors.description?.message as string}</p>}
            </div>

            {/* Variants Section */}
            <div className="space-y-4 border p-4 rounded-md bg-gray-50">
                <div className="flex justify-between items-center">
                    <Label className="font-semibold text-gray-700">Variants (Size/Color)</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ size: 'S', color: 'White', stock: 100 })}>
                        <Plus className="w-4 h-4 mr-1" /> Add Variant
                    </Button>
                </div>
                {fields.length === 0 && <p className="text-sm text-gray-500 italic">No variants added.</p>}
                {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-end bg-white p-2 rounded border">
                        <div className="flex-1">
                            <Label className="text-xs text-gray-500">Size</Label>
                            <select
                                {...form.register(`variants.${index}.size` as const)}
                                className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="2XL">2XL</option>
                                <option value="3XL">3XL</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <Label className="text-xs text-gray-500">Color</Label>
                            <select
                                {...form.register(`variants.${index}.color` as const)}
                                className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="White">White</option>
                                <option value="Black">Black</option>
                                <option value="Navy">Navy</option>
                            </select>
                        </div>
                        <div className="w-24">
                            <Label className="text-xs text-gray-500">Stock</Label>
                            <Input type="number" {...form.register(`variants.${index}.stock` as const, { valueAsNumber: true })} className="h-8" />
                        </div>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <input type="hidden" {...form.register(`variants.${index}.printfulVariantId` as any, { valueAsNumber: true })} />
                        <Button type="button" variant="destructive" size="icon" className="h-8 w-8" onClick={() => remove(index)}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>

            <div className="space-y-2">
                <Label>Images</Label>
                <ImageUpload
                    onImageSelected={handleImageSelected}
                    hidePreview={true}
                    onUploadStart={() => setIsImageUploading(true)}
                    onUploadEnd={() => setIsImageUploading(false)}
                />
                <div className="flex gap-2 mt-2 flex-wrap">
                    {(form.watch('images') || []).map((img: string, idx: number) => (
                        <div key={idx} className="relative group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt={`Product ${idx}`} className="w-20 h-20 object-cover rounded border" />
                            <button
                                type="button"
                                onClick={() => {
                                    const newImages = form.getValues('images')?.filter((_: string, i: number) => i !== idx);
                                    form.setValue('images', newImages || []);
                                }}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <Button type="submit" disabled={isLoading || isImageUploading} className="w-full">
                {isLoading ? 'Saving...' : (isImageUploading ? 'Uploading Please Wait...' : (isEdit ? 'Update Product' : 'Create Product'))}
            </Button>
        </form>
    );
}
