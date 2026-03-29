import Stripe from 'stripe';
import { ChargilyClient } from '@chargily/chargily-pay'
import Appointment from '../models/appointmentModel.js';
import Doctor from '../models/doctorModel.js';
import User from '../models/userModel.js';

//initialize stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//create stripe checkout session
const createCheckoutStripeSession = async (req, res) => {
    try {
        const userId = req.userId;
        const { appointmentId } = req.body;
        
        //check that appointment exists 
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        //check that the appointment belongs to the user
        if (appointment.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        //check that the appointment is not already paid
        if (appointment.isPaid) {
            return res.status(400).json({ success: false, message: 'Appointment already paid' });
        }

        //get patient and doctor data
        const doctor = await Doctor.findById(appointment.docId);
        const patient = await User.findById(userId);

        //create stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    unit_amount: appointment.amount * 100, // Stripe expects amount in cents
                    product_data: {
                        name: `Consultation with Dr. ${doctor.name}`,
                        description: `Consultation with Dr. ${doctor.name} - ${doctor.speciality} - for ${patient.name} - ${appointment.slotDate} at ${appointment.slotTime}`
                    }
                },
                quantity: 1
            }],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
            metadata: {
                appointmentId: appointment._id.toString(),
                userId: userId.toString(),
            },
            customer_email: patient.email,
        });
        
        //save the session id in the appointment for future reference
        appointment.stripeSessionId = session.id;
        await appointment.save();
        return res.status(200).json({ success: true, sessionUrl: session.url });
    }   
    catch (error) {
        console.error('Error creating checkout session:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

//verify payment
const verifyStripePayment = async (req, res) => {
    try {
        const { sessionId } = req.body;
        console.log('Verifying payment for session:', sessionId);
        if (!sessionId) {
            return res.status(400).json({ success: false, message: 'Session ID is required' });
        }
        
        //retrieve the session from stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        // Check if payment was successful
        if (session.payment_status === 'paid') {
            const appointmentId = session.metadata.appointmentId;
            
            // Update appointment as paid
            await Appointment.findByIdAndUpdate(appointmentId, {
                isPaid: true,
                paymentIntentId: session.payment_intent,
                paymentDate: new Date()
            });
            return res.status(200).json({ success: true, message: 'Payment verified successfully' });
        } else {
            return res.status(400).json({ success: false, message: 'Payment not successful' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

//
const chargilyClient = new ChargilyClient({
  api_key: process.env.CHARGILY_API_KEY,
  mode:    process.env.CHARGILY_MODE || 'test'
})


const createChargilyCheckout = async (req, res) => {
  try {
    const userId = req.userId
    const { appointmentId } = req.body

    // find appointment
    const appointment = await Appointment.findById(appointmentId)
    if (!appointment) {
      return res.json({ success: false, message: 'Appointment not found' })
    }

    // ownership check
    if (appointment.userId.toString() !== userId.toString()) {
      return res.json({ success: false, message: 'Not authorized' })
    }

    // already paid check
    if (appointment.isPaid) {
      return res.json({ success: false, message: 'Appointment already paid' })
    }
    // get doctor name for description
    const doctor = await Doctor.findById(appointment.docId)

    // create Chargily checkout
    const checkout = await chargilyClient.createCheckout({
      items: [{
        price:    appointment.amount * 100,  // centimes
        quantity: 1,
        name:     `Consultation - Dr. ${doctor.name}`,
      }],
      success_url: `${process.env.FRONTEND_URL}/payment-success`,
      failure_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      metadata: {
        appointmentId: appointment._id.toString(),
        userId:        userId.toString(),
      },
      description: `${appointment.slotDate} at ${appointment.slotTime}`,
      locale: 'ar',  // Arabic UI for Algerian users
    })

    // save checkout id on appointment
    await Appointment.findByIdAndUpdate(appointmentId, {
      chargilyCheckoutId: checkout.id
    })

    res.json({ success: true, checkoutUrl: checkout.checkout_url })
     } catch (error) {
    res.json({ success: false, message: error.message })
  }
}


const verifyChargilyPayment = async (req, res) => {
  try {
    const { checkoutId } = req.body

    if (!checkoutId) {
      return res.json({ success: false, message: 'Checkout ID required' })
    }

    // retrieve checkout from Chargily
    const checkout = await chargilyClient.getCheckout(checkoutId)

    if (checkout.status === 'paid') {
      const appointmentId = checkout.metadata.appointmentId

      await Appointment.findByIdAndUpdate(appointmentId, {
        isPaid:      true,
        paymentDate: new Date(),
      })

      return res.json({ success: true, message: 'Payment verified successfully' })
    }

    res.json({ success: false, message: 'Payment not completed' })

  } catch (error) {
     res.json({ success: false, message: error.message })
  }
}

export { createCheckoutStripeSession, verifyStripePayment ,createChargilyCheckout, verifyChargilyPayment }