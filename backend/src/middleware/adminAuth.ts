import { Request, Response, NextFunction } from 'express';
import { config } from '../infrastructure/config';
import jwt from 'jsonwebtoken';

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
    // Legacy support for x-admin-key (can be removed later if frontend fully migrates)
    const apiKey = req.headers['x-admin-key'];
    if (apiKey && apiKey === config.ADMIN_API_KEY) {
        return next();
    }

    // JWT verification
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.warn(`[AdminAuth] Unauthorized access attempt (No token).`);
        res.status(401).json({ error: 'Unauthorized: Missing token' });
        return;
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET) as { role?: string };
        if (decoded.role !== 'admin') {
            throw new Error('Invalid role');
        }
        next();
    } catch (err) {
        console.warn(`[AdminAuth] Unauthorized access attempt (Invalid token).`);
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};
