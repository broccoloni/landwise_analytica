'use client';

import { useState, useEffect, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import Loading from '@/components/Loading';
import { useCartContext } from '@/contexts/CartContext';
import { useReportContext } from '@/contexts/ReportContext';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Checkout() {
  const { quantity } = useCartContext();

  const reportContext = useReportContext();
  useEffect(() => {
    console.log("Report context:", reportContext);
  }, [reportContext]);
    
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({});

  const fetchClientSecret = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session.');
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
    <div id="checkout" className="flex justify-center items-center w-full px-10 py-10 rounded-lg">
      {loading ? (
        <Loading />
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
