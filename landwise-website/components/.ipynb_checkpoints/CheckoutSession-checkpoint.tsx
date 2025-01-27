'use client';

import { useState, useEffect, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import Loading from '@/components/Loading';
import { useCartContext } from '@/contexts/CartContext';

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing Stripe public key in environment variables');
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

interface CheckoutOptions {
  clientSecret: string;
}

export default function CheckoutSession({ onComplete }:{ onComplete: (sessionId: string) => void; }) {
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<CheckoutOptions>({ clientSecret: '' });
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { quantity, couponId, customerId, priceId, size } = useCartContext();

  const fetchClientSecret = useCallback(async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity, customerId, couponId, priceId, size }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session.');
      }

      const data = await response.json();

      if (!data.clientSecret || !data.sessionId) {
        throw new Error('Required data missing from response.');
      }

      setSessionId(data.sessionId);
      setOptions({ clientSecret: data.clientSecret });
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [quantity, customerId]);

  useEffect(() => {
    if (quantity && loading) {
      fetchClientSecret();
    }
  }, [fetchClientSecret, quantity, loading]);

  const handleComplete = async () => {
    if (sessionId === null) {
      console.log("Session ID is null on completiong");
      return;
    }
    onComplete(sessionId);
  };

  return (
    <div id="checkout" className="flex justify-center items-center">
      {loading ? (
        <div className="p-20">
          <Loading />
        </div>
      ) : options.clientSecret ? (
        <EmbeddedCheckoutProvider 
          stripe={stripePromise} 
          options={{
            ...options,
            onComplete: handleComplete
          }} 
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      ) : (
        <div>
          Unable to load checkout. Please try again later.
        </div>
      )}
    </div>
  );
}
