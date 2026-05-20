import Stripe from 'stripe';
import Appointment from '../models/appointmentModel.js';
import Doctor from '../models/doctorModel.js';
import User from '../models/userModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// --- STRIPE: CREATE SESSION ---
export const createCheckoutStripeSession = async (req, res) => {
  try {
    const userId = req.userId;
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    const doctor = await Doctor.findById(appointment.docId);
    const patient = await User.findById(userId);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          unit_amount: appointment.amount * 100,
          product_data: { name: `Consultation - Dr. ${doctor.name}` }
        },
        quantity: 1
      }],
      mode: 'payment',
      // Added query params so the frontend knows what to verify
      success_url: `${process.env.FRONTEND_URL}/profile?payment_status=success&appointment_id=${appointmentId}&payment_method=stripe&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/profile?payment_status=cancelled`,
      metadata: { appointmentId: appointmentId.toString() },
      customer_email: patient.email,
    });

    res.status(200).json({ success: true, sessionUrl: session.url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- STRIPE: VERIFY ---
export const verifyStripePayment = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const appointmentId = session.metadata.appointmentId;
      await Appointment.findByIdAndUpdate(appointmentId, {
        isPaid: true,
        paymentDate: new Date(),
        paymentIntentId: session.payment_intent
      });
      return res.json({ success: true, message: 'Payment verified' });
    }
    res.json({ success: false, message: 'Payment failed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};