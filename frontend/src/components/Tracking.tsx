'use client';

import { useEffect } from 'react';

export function useTracking(eventType: 'page_view' | 'view_product' | 'initiate_checkout', productId?: string) {
    useEffect(() => {
        const track = async () => {
            try {
                // Get referrer
                const source = document.referrer || 'direct';

                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/track`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        eventType,
                        productId,
                        source
                    })
                });
            } catch (err) {
                console.error('Failed to track event', err);
            }
        };

        track();
    }, [eventType, productId]);
}

export function PageViewTracker({ eventType = 'page_view', productId }: { eventType?: 'page_view' | 'view_product' | 'initiate_checkout', productId?: string }) {
    useTracking(eventType, productId);
    return null;
}
