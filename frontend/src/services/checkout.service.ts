import { api } from "../lib/api";
import { CheckoutSessionResponse } from "../types";

export interface CreateCheckoutSessionRequest {
    productId: string;
    quantity: number;
    variant?: {
        size?: string;
        color?: string;
    };
}

export const checkoutService = {
    createSession: async (payload: CreateCheckoutSessionRequest): Promise<CheckoutSessionResponse> => {
        const { data } = await api.post<CheckoutSessionResponse>("/checkout", payload);
        return data;
    },
};
