
import { loadStripe } from '@stripe/stripe-js'

let stripePromise = null

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY)
  }
  return stripePromise
}