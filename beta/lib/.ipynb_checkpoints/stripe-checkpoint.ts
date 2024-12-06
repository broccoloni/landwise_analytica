import Stripe from 'stripe';

const stripe_secret = process.env.STRIPE_SECRET_KEY

if (!stripe_secret) {
  throw new Error('Stripe secret key is not defined in the environment variables');
}

export const stripe = new Stripe(stripe_secret);