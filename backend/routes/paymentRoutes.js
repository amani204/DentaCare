
import express from 'express';
import { createCheckoutStripeSession, verifyStripePayment, createChargilyCheckout, verifyChargilyPayment  } from '../controllers/paymentController.js';
import { authPatient } from '../middleware/authMiddleware.js';

const paymentRouter = express.Router();

// Protected routes (require patient to be logged in)
paymentRouter.post('/stripe-checkout',   authPatient, createCheckoutStripeSession)
paymentRouter.post('/stripe-verify',     authPatient, verifyStripePayment)
paymentRouter.post('/chargily-checkout', authPatient, createChargilyCheckout)
paymentRouter.post('/chargily-verify',   authPatient, verifyChargilyPayment)

export default paymentRouter;