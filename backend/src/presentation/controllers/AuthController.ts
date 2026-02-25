import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../infrastructure/config';
import { logger } from '../../app';

export class AuthController {
    static async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;

            if (username === config.ADMIN_USERNAME && password === config.ADMIN_PASSWORD) {
                const token = jwt.sign({ role: 'admin' }, config.JWT_SECRET, { expiresIn: '1d' });
                res.status(200).json({ token });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        } catch (error) {
            logger.error({ err: error }, 'Login Error');
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
