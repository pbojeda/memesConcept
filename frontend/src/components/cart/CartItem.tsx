import React from 'react';
import { CartItem as CartItemType, useCartStore } from '@/store/cartStore';
import { QuantitySelector } from '../product/QuantitySelector';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export const CartItem: React.FC<{ item: CartItemType }> = ({ item }) => {
    const { updateQuantity, removeItem } = useCartStore();

    return (
        <div className="flex items-center space-x-4 py-4 border-b" data-testid="cart-item">
            <div className="relative w-16 h-16 shrink-0">
                <Image src={item.product.image || '/placeholder.png'} alt={item.product.name} fill className="object-cover rounded" />
            </div>
            <div className="flex-grow">
                <h4 className="font-semibold">{item.product.name}</h4>
                {item.variant && (
                    <p className="text-sm text-gray-500">
                        {item.variant.size && `Size: ${item.variant.size}`}
                        {item.variant.color && ` Color: ${item.variant.color}`}
                    </p>
                )}
                <div className="mt-2 flex items-center justify-between">
                    <QuantitySelector
                        quantity={item.quantity}
                        onChange={(q) => updateQuantity(item.productId, q, item.variant?.printfulVariantId)}
                    />
                    <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.productId, item.variant?.printfulVariantId)}
                data-testid="cart-item-remove"
            >
                <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
        </div>
    );
};
