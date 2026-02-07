import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';
import Order from '../models/orderModel';

// Lazy initialize stripe only when needed
let stripe: Stripe | null = null;

const getStripe = (): Stripe => {
    if (!stripe) {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey) {
            throw new Error('STRIPE_SECRET_KEY is not configured');
        }
        stripe = new Stripe(secretKey);
    }
    return stripe;
};

// @desc    Create payment intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
const createPaymentIntent = asyncHandler(async (req: Request, res: Response) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    // Check if already paid
    if (order.isPaid) {
        res.status(400);
        throw new Error('Order already paid');
    }

    // Create PaymentIntent
    const paymentIntent = await getStripe().paymentIntents.create({
        amount: Math.round(order.totalPrice * 100), // Stripe uses cents
        currency: 'usd',
        metadata: {
            orderId: orderId,
        },
    });

    res.json({
        clientSecret: paymentIntent.client_secret,
    });
});

// @desc    Handle Stripe webhook
// @route   POST /api/payments/webhook
// @access  Public
const stripeWebhook = asyncHandler(async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

    let event;

    try {
        event = getStripe().webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: unknown) {
        console.error('Webhook signature verification failed.');
        res.status(400).send(`Webhook Error: ${(err as Error).message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            const orderId = paymentIntent.metadata.orderId;

            // Update order
            const order = await Order.findById(orderId);
            if (order && !order.isPaid) {
                order.isPaid = true;
                order.paidAt = new Date();
                order.status = 'Processing';
                order.paymentResult = {
                    id: paymentIntent.id,
                    status: paymentIntent.status,
                    update_time: new Date().toISOString(),
                    email_address: paymentIntent.receipt_email || '',
                };
                await order.save();
                console.log(`Order ${orderId} marked as paid via webhook`);
            }
            break;

        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object as Stripe.PaymentIntent;
            console.error(`Payment failed for order: ${failedPayment.metadata.orderId}`);
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
});

// @desc    Get Stripe publishable key
// @route   GET /api/payments/config
// @access  Public
const getStripeConfig = asyncHandler(async (req: Request, res: Response) => {
    res.json({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    });
});

export {
    createPaymentIntent,
    stripeWebhook,
    getStripeConfig,
};
