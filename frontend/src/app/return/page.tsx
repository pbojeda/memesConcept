"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ReturnContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
        return (
            <div className="text-center p-12">
                <h1 className="text-2xl font-bold text-red-600">Invalid Session</h1>
                <p className="mt-2 text-gray-600">We couldn't retrieve your order details.</p>
                <a href="/" className="mt-6 inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">Return to Home</a>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg mx-auto bg-white shadow-lg rounded-xl overflow-hidden mt-10 border border-gray-100">
            <div className="bg-green-500 p-8 text-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h1 className="text-3xl font-bold">Order Confirmed!</h1>
                <p className="mt-2 text-green-100 text-lg">Thank you for your purchase.</p>
            </div>

            <div className="p-8 space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Order Reference (Session ID)</p>
                    <code className="block text-xs bg-gray-200 p-2 rounded text-gray-700 break-all">{sessionId}</code>
                </div>

                <p className="text-center text-gray-600">
                    We will send a confirmation email with your order details shortly.
                </p>

                <a href="/" className="block w-full py-3 px-4 bg-black text-white text-center rounded-lg font-medium hover:bg-gray-800 transition-transform active:scale-95">
                    Continue Shopping
                </a>
            </div>
        </div>
    );
}

export default function ReturnPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<div className="text-center">Loading order details...</div>}>
                <ReturnContent />
            </Suspense>
        </div>
    );
}
