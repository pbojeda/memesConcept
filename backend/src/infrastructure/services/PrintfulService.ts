import fetch from 'node-fetch';
import { config } from '../config';
import { logger } from '../../app';

interface PrintfulCreateProductData {
    sync_product: {
        name: string;
        thumbnail?: string;
    };
    sync_variants: {
        variant_id: number;
        retail_price: string;
        files: { url: string }[];
        options?: any[];
    }[];
}

interface PrintfulOrderData {
    external_id: string; // Our local DB order ID
    shipping: "STANDARD" | "EXPRESS";
    recipient: {
        name: string;
        address1: string;
        address2?: string;
        city: string;
        state_code?: string;
        country_code: string;
        zip: string;
        email?: string;
        phone?: string;
    };
    items: {
        sync_variant_id: number; // The specific variation to print
        quantity: number;
        retail_price: string;
    }[];
}

export class PrintfulService {
    private static readonly BASE_URL = 'https://api.printful.com';

    private static get headers() {
        if (!config.PRINTFUL_API_KEY) {
            logger.warn("⚠️ PRINTFUL_API_KEY is not set. Printful integration will fail.");
        }
        return {
            'Authorization': `Bearer ${config.PRINTFUL_API_KEY}`,
            'Content-Type': 'application/json',
            'X-PF-Language': 'en', // Important to avoid weird parsing errors
            ...(config.PRINTFUL_STORE_ID && { 'X-PF-Store-Id': config.PRINTFUL_STORE_ID })
        };
    }

    /**
     * Creates a new Sync Product with its associated variants in Printful.
     */
    static async createSyncProduct(data: PrintfulCreateProductData) {
        if (!config.PRINTFUL_API_KEY) {
            logger.warn("Skipping Printful API call because PRINTFUL_API_KEY is null.");
            // Return placeholder for tests/dev to not crash if missing api key
            return {
                id: Math.floor(Math.random() * 100000),
                sync_variants: data.sync_variants.map(v => ({ id: Math.floor(Math.random() * 100000), variant_id: v.variant_id }))
            };
        }

        const response = await fetch(`${this.BASE_URL}/store/products`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Printful Product Creation Error: ${response.status} - ${errorText}`);
        }

        const result = await response.json() as any;
        return result.result; // Printful wraps data in a 'result' key
    }

    /**
     * Gets a detailed Sync Product from Printful including sync_variants.
     */
    static async getSyncProduct(id: number) {
        if (!config.PRINTFUL_API_KEY) {
            return null;
        }
        const response = await fetch(`${this.BASE_URL}/store/products/${id}`, {
            method: 'GET',
            headers: this.headers
        });

        if (!response.ok) {
            throw new Error(`Printful Product Fetch Error: ${response.status}`);
        }

        const result = await response.json() as any;
        return result.result;
    }

    /**
     * Dispatches an order directly to Printful's system.
     */
    static async createOrder(orderData: PrintfulOrderData) {
        if (!config.PRINTFUL_API_KEY) {
            logger.warn("Skipping Printful API call because PRINTFUL_API_KEY is null.");
            return { id: "mock_order_123" };
        }

        // Add 'confirm: true' to immediately send to production, 
        // or false to save as a Draft in Printful UI. Going with Draft (false) for MVP safety
        const queryParams = new URLSearchParams({ confirm: 'false' });

        const response = await fetch(`${this.BASE_URL}/orders?${queryParams}`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Printful Order Creation Error: ${response.status} - ${errorText}`);
        }

        const result = await response.json() as any;
        return result.result;
    }
}
