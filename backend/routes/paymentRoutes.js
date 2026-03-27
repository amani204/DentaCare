
import express from 'express';
import { createCheckoutSession, verifyPayment } from '../controllers/paymentController.js';
import { authPatient } from '../middleware/authMiddleware.js';

const paymentRouter = express.Router();

// Protected routes (require patient to be logged in)
paymentRouter.post('/create-session', authPatient, createCheckoutSession);
paymentRouter.post('/verify', authPatient, verifyPayment);

export default paymentRouter;