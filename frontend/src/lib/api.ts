import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001",
    headers: {
        "Content-Type": "application/json",
    },
});

// Response interceptor for better error handling if needed
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Maybe log to monitoring or handle 401s
        return Promise.reject(error);
    }
);
