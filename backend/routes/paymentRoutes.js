
import express from 'express';
import { createCheckoutStripeSession, verifyStripePayment  } from '../controllers/paymentController.js';
import { authPatient } from '../middleware/authMiddleware.js';

const paymentRouter = express.Router();

// Protected routes (require patient to be logged in)
paymentRouter.post('/stripe-checkout',   authPatient, createCheckoutStripeSession)
paymentRouter.post('/stripe-verify',     authPatient, verifyStripePayment)

export default paymentRouter;