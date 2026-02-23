"use client";

import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import { ProductVariant } from "../../types";

interface VariantSelectorProps {
    variants: ProductVariant[];
    selectedVariant: ProductVariant | null;
    onSelect: (variant: ProductVariant | null) => void;
}

export function VariantSelector({ variants, selectedVariant, onSelect }: VariantSelectorProps) {
    // Collect all unique sizes and colors from ALL variants, regardless of stock
    const sizes = Array.from(new Set(variants.map(v => v.size).filter(Boolean))) as string[];
    const colors = Array.from(new Set(variants.map(v => v.color).filter(Boolean))) as string[];

    const hasSizes = sizes.length > 0;
    const hasColors = colors.length > 0;

    // Use local state for the user's independent selections
    const [selectedSize, setSelectedSize] = useState<string | undefined>(selectedVariant?.size);
    const [selectedColor, setSelectedColor] = useState<string | undefined>(selectedVariant?.color);

    // Sync with external selectedVariant if it changes unexpectedly
    useEffect(() => {
        if (selectedVariant) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedSize(selectedVariant.size);
            setSelectedColor(selectedVariant.color);
        }
    }, [selectedVariant]);

    if (!hasSizes && !hasColors) return null;

    // Function to handle selection logic: independently tracking size/color
    const handleSelectSize = (size: string) => {
        setSelectedSize(size);
        const match = variants.find(v => v.size === size && (hasColors ? v.color === selectedColor : true) && v.stock > 0);
        onSelect(match || null);
    };

    const handleSelectColor = (color: string) => {
        setSelectedColor(color);
        const match = variants.find(v => (hasSizes ? v.size === selectedSize : true) && v.color === color && v.stock > 0);
        onSelect(match || null);
    };

    return (
        <div className="space-y-4">
            {hasSizes && (
                <div>
                    <h3 className="text-sm font-medium text-gray-900">
                        Size <span className="text-gray-500 text-xs font-normal ml-2">{selectedSize || "Select..."}</span>
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {sizes.map((size) => {
                            // Find if ANY variant has this size and is in stock
                            const isAvailable = variants.some(v => v.size === size && v.stock > 0);
                            return (
                                <button
                                    key={size}
                                    onClick={() => handleSelectSize(size)}
                                    className={cn(
                                        "border rounded-md px-3 py-1 text-sm transition-all relative overflow-hidden",
                                        selectedSize === size
                                            ? "border-black bg-black text-white"
                                            : isAvailable
                                                ? "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
                                                : "border-gray-100 bg-gray-50 text-gray-400 opacity-60"
                                    )}
                                >
                                    {size}
                                    {!isAvailable && (
                                        <div className="absolute top-1/2 left-0 w-full border-t border-gray-300 -rotate-12 transform-gpu"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {hasColors && (
                <div>
                    <h3 className="text-sm font-medium text-gray-900">
                        Color <span className="text-gray-500 text-xs font-normal ml-2">{selectedColor || "Select..."}</span>
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {colors.map((color) => {
                            // Find if ANY variant has this color and is in stock
                            const isAvailable = variants.some(v => v.color === color && v.stock > 0);
                            return (
                                <button
                                    key={color}
                                    onClick={() => handleSelectColor(color)}
                                    className={cn(
                                        "border rounded-md px-3 py-1 text-sm transition-all relative overflow-hidden",
                                        selectedColor === color
                                            ? "border-black bg-black text-white"
                                            : isAvailable
                                                ? "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
                                                : "border-gray-100 bg-gray-50 text-gray-400 opacity-60"
                                    )}
                                >
                                    {color}
                                    {!isAvailable && (
                                        <div className="absolute top-1/2 left-0 w-full border-t border-gray-300 -rotate-12 transform-gpu"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
