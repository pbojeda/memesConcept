import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default('3000').transform((val) => parseInt(val, 10)),
    MONGO_URI: z.string().url(),
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    FRONTEND_URL: z.string().url().default('http://localhost:3000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    ADMIN_API_KEY: z.string().min(1).default('secret-key'), // Default for ease of use in dev, but should be set in prod
    CLOUDINARY_CLOUD_NAME: z.string().optional(), // Optional for now to not break existing setup if not set immediately
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),
    PRINTFUL_API_KEY: z.string().optional(), // Optional initially to avoid breaking tests/CI that don't have it yet. Make required later.
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error('❌ Invalid environment variables:', JSON.stringify(parsedEnv.error.format(), null, 4));
    throw new Error('Invalid environment variables');
}

export const config = parsedEnv.data;
