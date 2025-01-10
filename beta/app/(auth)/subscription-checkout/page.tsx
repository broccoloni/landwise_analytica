'use client';

import { useState, useEffect, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import Loading from '@/components/Loading';
import { useCartContext } from '@/contexts/CartContext';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function SubscriptionCheckout() {
  const { priceId, customerId } = useCartContext();
    
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({});

  const fetchClientSecret = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/createSubscription", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, customerId }),
      });

      if (!response.ok) {
        
        throw new Error(`Failed to create checkout session. ${response.error}`);
      }

      const data = await response.json();

      if (!data.clientSecret) {
        throw new Error('Client secret is missing from response');
      }

      setOptions({ clientSecret: data.clientSecret });
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientSecret();
  }, [fetchClientSecret]);

  return (
    <div id="checkout" className="flex justify-center items-center w-full rounded-lg">
      {loading ? (
        <div className="w-lg h-lg m-auto">
          <Loading />
        </div>
      ) : (
        options.clientSecret ? (
          <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        ) : (
          <div>
            Unable to load checkout. Please try again later.
          </div>
        )
      )}
    </div>
  );
}
