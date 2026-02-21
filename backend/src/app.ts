import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pino from 'pino';
import dotenv from 'dotenv';
import { config } from './infrastructure/config';

dotenv.config();

const app = express();
const logger = pino({
    transport: {
        target: 'pino-pretty'
    }
});

app.use(helmet());
app.use(cors());

// Audit logger middleware
app.use((req: Request, res: Response, next: import('express').NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData: any = {
            type: res.statusCode >= 500 ? 'CRITICAL' : res.statusCode >= 400 ? 'ERROR' : 'AUDIT',
            method: req.method,
            path: req.originalUrl,
            userAgent: req.headers['user-agent'] || 'Unknown',
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
        };

        if (res.locals.errorMessage) {
            logData.errorMessage = res.locals.errorMessage;
        }

        if (res.statusCode >= 500) {
            logger.error(logData, 'API Request Server Error');
        } else if (res.statusCode >= 400) {
            logger.warn(logData, 'API Request Client Error');
        } else {
            logger.info(logData, 'API Request Processed');
        }
    });
    next();
});
// Routes
import { productRouter } from './presentation/routes/productRoutes';
import { checkoutRouter } from './presentation/routes/checkoutRoutes';
import { webhookRouter } from './presentation/routes/webhookRoutes';
import adminProductRouter from './presentation/routes/adminProductRoutes'; // Import Admin Router

// Webhook route needs raw body
app.use('/webhook', express.raw({ type: 'application/json' }), webhookRouter);

// JSON parser for other routes
// JSON parser for other routes (increased limit for base64 images)
app.use(express.json({ limit: '50mb' }));

app.use('/products', productRouter);
app.use('/checkout', checkoutRouter);
app.use('/admin/products', adminProductRouter); // Register Admin Routes

// Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: import('express').NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : 'Internal Server Error';

    res.locals.errorMessage = err.message || message; // Save for audit logger

    // Log unexpected errors
    if (statusCode === 500) {
        logger.error({ err }, 'Unexpected Error');
    }

    res.status(statusCode).json({
        success: false,
        error: { message, code: err.name }
    });
});

export { app, logger };
