"use client";

import { useMutation } from "@tanstack/react-query";
import { checkoutService } from "../../services/checkout.service";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { ProductVariant } from "../../types";

interface BuyButtonProps {
    productId: string;
    selectedVariant: ProductVariant | null;
    quantity?: number;
    onCheckoutStart?: (clientSecret: string) => void;
    disabled?: boolean;
}

export function BuyButton({ productId, selectedVariant, quantity = 1, onCheckoutStart, disabled }: BuyButtonProps) {
    const mutation = useMutation({
        mutationFn: () => checkoutService.createSession({
            productId,
            quantity,
            variant: selectedVariant ? { size: selectedVariant.size, color: selectedVariant.color } : undefined
        }),
        onSuccess: (data) => {
            if (onCheckoutStart) {
                onCheckoutStart(data.clientSecret);
            }
        },
        onError: (error) => {
            console.error("Checkout failed", error);
            alert("Failed to start checkout. Please try again.");
        }
    });

    return (
        <Button
            className="w-full h-12 text-lg"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || disabled}
        >
            {mutation.isPending ? <Spinner className="mr-2" /> : "Buy Now"}
        </Button>
    );
}
