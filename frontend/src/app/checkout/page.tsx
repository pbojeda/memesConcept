'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { EmbeddedCheckoutComponent } from '@/components/checkout/EmbeddedCheckout';

function CheckoutContent() {
    const searchParams = useSearchParams();
    const clientSecret = searchParams.get('clientSecret');

    if (!clientSecret) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center p-8 bg-white shadow-md rounded-lg">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Invalid Session</h2>
                    <p className="text-gray-600">No checkout session could be found. Please return to the store and try again.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-center mb-8">Complete your Order</h1>
            <EmbeddedCheckoutComponent clientSecret={clientSecret} />
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading checkout...</div>}>
                <CheckoutContent />
            </Suspense>
        </div>
    );
}
