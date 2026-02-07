import express from 'express';
import {
    createPaymentIntent,
    stripeWebhook,
    getStripeConfig,
} from '../controllers/paymentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/config', getStripeConfig);
router.post('/create-payment-intent', protect, createPaymentIntent);
// Note: Webhook needs raw body, handled separately in app.ts
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

export default router;
