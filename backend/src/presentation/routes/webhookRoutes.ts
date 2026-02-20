import { Router } from 'express';
import { webhookController } from '../controllers/WebhookController';
import express from 'express';

const router = Router();

// Use raw body for this route specifically? 
// No, usually middleware is applied at app level, but we can do it here if we mount it appropriately without global json parser interfering.
// But simpler to just define the handler here.

router.post('/stripe', webhookController.handleStripeWebhook);

export { router as webhookRouter };
