import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductVariant } from '@/types';

export interface CartItem {
    productId: string;
    quantity: number;
    variant?: ProductVariant;
    product: {
        name: string;
        price: number;
        image: string;
    };
}

interface CartState {
    items: CartItem[];
    addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
    removeItem: (productId: string, printfulVariantId?: number) => void;
    updateQuantity: (productId: string, quantity: number, printfulVariantId?: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            setIsOpen: (isOpen) => set({ isOpen }),
            addItem: (product, variant, quantity = 1) => {
                set((state) => {
                    const existingItemIndex = state.items.findIndex(
                        (item) => item.productId === product.id && item.variant?.printfulVariantId === variant?.printfulVariantId
                    );

                    if (existingItemIndex > -1) {
                        const newItems = [...state.items];
                        newItems[existingItemIndex].quantity += quantity;
                        return { items: newItems };
                    }

                    return {
                        items: [
                            ...state.items,
                            {
                                productId: product.id,
                                quantity,
                                variant,
                                product: {
                                    name: product.name,
                                    price: product.price,
                                    image: product.images?.[0] || product.imageUrl || '',
                                }
                            },
                        ],
                    };
                });
            },
            removeItem: (productId, printfulVariantId) => {
                set((state) => ({
                    items: state.items.filter(
                        (item) => !(item.productId === productId && item.variant?.printfulVariantId === printfulVariantId)
                    ),
                }));
            },
            updateQuantity: (productId, quantity, printfulVariantId) => {
                set((state) => ({
                    items: state.items.map((item) =>
                        item.productId === productId && item.variant?.printfulVariantId === printfulVariantId
                            ? { ...item, quantity: Math.max(1, quantity) }
                            : item
                    ),
                }));
            },
            clearCart: () => set({ items: [] }),
            getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
            getTotalPrice: () =>
                get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
        }),
        {
            name: 'shopping-cart',
        }
    )
);
