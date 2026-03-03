'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { CartDrawer } from '../cart/CartDrawer';

export const Header: React.FC = () => {
    // Need to hydrate safely for zustand + nextjs SSR
    const [isMounted, setIsMounted] = useState(false);
    const { isOpen, setIsOpen, getTotalItems } = useCartStore();
    const totalItems = getTotalItems();

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <>
            <header className="bg-white border-b sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-primary">
                        Memes Concept
                    </Link>
                    <button
                        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={() => setIsOpen(true)}
                        data-testid="cart-icon"
                    >
                        <ShoppingCart className="h-6 w-6" />
                        {isMounted && totalItems > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </button>
                </div>
            </header>
            <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};
