// Pentru client-side (browser)
import { loadStripe, Stripe as StripeClient } from '@stripe/stripe-js';

// Singleton pattern pentru a evita instanțieri multiple
let stripePromise: Promise<StripeClient | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

// Pentru server-side (Node.js)
import Stripe from 'stripe';

// Verificăm și folosim cheia API Stripe în mod sigur
const getStripeInstance = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('Missing STRIPE_SECRET_KEY environment variable');
  }
  return new Stripe(key, {
    apiVersion: '2025-04-30.basil',
  });
};

// Export un singleton pentru a evita crearea multiplă a instanței
export const stripe = getStripeInstance();