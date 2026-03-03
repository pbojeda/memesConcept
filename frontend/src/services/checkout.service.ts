import { api } from "../lib/api";
import { CheckoutSessionResponse } from "../types";

export interface CreateCheckoutSessionItem {
    productId: string;
    quantity: number;
    variant?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface CreateCheckoutSessionRequest {
    items: CreateCheckoutSessionItem[];
    returnUrl?: string;
}

export const checkoutService = {
    createSession: async (payload: CreateCheckoutSessionRequest): Promise<CheckoutSessionResponse> => {
        const { data } = await api.post<CheckoutSessionResponse>("/checkout", payload);
        return data;
    },
    getOrder: async (sessionId: string) => {
        const { data } = await api.get(`/checkout/session/${sessionId}`);
        return data;
    }
};
