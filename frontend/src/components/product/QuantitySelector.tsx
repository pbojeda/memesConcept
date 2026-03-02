import React from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
    quantity: number;
    onChange: (q: number) => void;
    min?: number;
    max?: number;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
    quantity,
    onChange,
    min = 1,
    max = 99,
}) => {
    return (
        <div className="flex items-center space-x-2">
            <Button
                variant="outline"
                size="icon"
                onClick={() => onChange(Math.max(min, quantity - 1))}
                disabled={quantity <= min}
                data-testid="quantity-decrease"
            >
                <Minus className="h-4 w-4" />
            </Button>
            <input
                type="number"
                value={quantity}
                readOnly
                className="w-12 text-center bg-transparent border-none font-medium"
                data-testid="quantity-selector-input"
            />
            <Button
                variant="outline"
                size="icon"
                onClick={() => onChange(Math.min(max, quantity + 1))}
                disabled={quantity >= max}
                data-testid="quantity-increase"
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    );
};
