import { Request, Response, NextFunction } from 'express';
import { checkoutService } from '../../application/services/CheckoutService';
import { checkoutSchema } from '../../application/validators/checkoutValidator';
import { ValidationError } from '../../domain/errors';

export class CheckoutController {
    async createSession(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate input
            const validation = checkoutSchema.safeParse(req.body);

            if (!validation.success) {
                const errorMessage = validation.error.issues.map((e: any) => e.message).join(', ');
                throw new ValidationError(errorMessage);
            }

            const result = await checkoutService.createCheckoutSession(validation.data);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

export const checkoutController = new CheckoutController();
