"use client";

import { loadStripe } from "@stripe/stripe-js";
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout,
} from "@stripe/react-stripe-js";

// Initializing stripe outside component to avoid recreation
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface EmbeddedCheckoutProps {
    clientSecret: string;
}

export function EmbeddedCheckoutComponent({ clientSecret }: EmbeddedCheckoutProps) {
    const options = { clientSecret };

    return (
        <div className="w-full max-w-4xl mx-auto rounded-lg bg-white shadow-xl p-4">
            <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={options}
            >
                <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
        </div>
    );
}
