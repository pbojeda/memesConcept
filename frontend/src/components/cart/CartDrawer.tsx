import React from 'react';
import { useCartStore } from '@/store/cartStore';
import { CartItem } from './CartItem';
import { Button } from '@/components/ui/button';
import { checkoutService } from '@/services/checkout.service';
import { ShoppingCart, X } from 'lucide-react';

export const CartDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { items, getTotalPrice } = useCartStore();

    const handleCheckout = async () => {
        try {
            const { clientSecret } = await checkoutService.createSession({ items });
            // Integration with Stripe Embedded Checkout would happen here. For MVP we will just redirect to our checkout page if we had a dedicated one, or handle the provider in the Drawer.
            // Since `EmbeddedCheckoutProvider` requires `clientSecret`, we can redirect to a `/checkout?session_id=${session_id}` or similar if we adapt the flow, but let's assume `createCheckoutSession` redirects as it used to in `ProductDetailClient`.
            if (clientSecret) {
                // In ProductDetailClient it opened the modal. 
                // We can dispatch an event or use a router push to a checkout page. 
                // Assuming we adapt a full page checkout for MVP-13 to simplify over drawer-embedded.
                window.location.href = `/checkout?clientSecret=${clientSecret}`;
            }
        } catch (error) {
            console.error('Checkout failed', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden" data-testid="cart-drawer">
            <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
            <div className="absolute inset-y-0 right-0 max-w-full flex">
                <div className="relative w-screen max-w-md bg-white shadow-xl flex flex-col pointer-events-auto">
                    <div className="p-4 flex items-center justify-between border-b">
                        <h2 className="text-lg font-bold flex items-center">
                            <ShoppingCart className="mr-2" /> Shopping Cart
                        </h2>
                        <button
                            className="p-2 hover:bg-gray-100 rounded-full"
                            onClick={onClose}
                            aria-label="Close cart"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="flex-grow overflow-y-auto p-4">
                        {items.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
                                <p>Your cart is empty</p>
                            </div>
                        ) : (
                            items.map((item) => <CartItem key={`${item.productId}-${item.variant?.printfulVariantId}`} item={item} />)
                        )}
                    </div>
                    <div className="p-4 border-t bg-gray-50">
                        <div className="flex justify-between font-bold text-xl mb-4">
                            <span>Total</span>
                            <span>${getTotalPrice().toFixed(2)}</span>
                        </div>
                        <Button
                            className="w-full py-6 text-lg"
                            disabled={items.length === 0}
                            onClick={handleCheckout}
                            data-testid="checkout-button"
                        >
                            Checkout
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full mt-2"
                            onClick={onClose}
                            data-testid="continue-shopping"
                        >
                            Continue Shopping
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
