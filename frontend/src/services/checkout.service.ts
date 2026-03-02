import { api } from "../lib/api";
import { CheckoutSessionResponse } from "../types";

export interface CreateCheckoutSessionItem {
    productId: string;
    quantity: number;
    variant?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface CreateCheckoutSessionRequest {
    items: CreateCheckoutSessionItem[];
}

export const checkoutService = {
    createSession: async (payload: CreateCheckoutSessionRequest): Promise<CheckoutSessionResponse> => {
        const { data } = await api.post<CheckoutSessionResponse>("/checkout", payload);
        return data;
    },
};
