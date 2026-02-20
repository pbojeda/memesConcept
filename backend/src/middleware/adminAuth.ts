
import { Request, Response, NextFunction } from 'express';
import { config } from '../infrastructure/config';

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-admin-key'];

    // Debug Log (Remove in Prod)
    console.log(`[AdminAuth] Header: '${apiKey}', Config: '${config.ADMIN_API_KEY}'`);

    if (!apiKey || apiKey !== config.ADMIN_API_KEY) {
        console.warn(`[AdminAuth] Unauthorized access attempt.`);
        res.status(401).json({ error: 'Unauthorized: Invalid or missing API Key' });
        return;
    }

    next();
};
