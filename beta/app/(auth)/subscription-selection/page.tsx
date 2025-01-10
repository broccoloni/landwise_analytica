'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCartContext } from '@/contexts/CartContext';
import Link from 'next/link';
import Loading from '@/components/Loading';
import { fetchSubscriptionPrices } from '@/utils/stripe';
import { ArrowRight } from 'lucide-react';

export default function SubscriptionSelection() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setPriceId, setCustomerId } = useCartContext();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSubscriptionPrices = async () => {
      try {
        const prices = await fetchSubscriptionPrices();
        const { subscription: subscription_details, subscription_pilot } = prices;

        // setSubscription(subscription_details);
        setSubscription(subscription_pilot);
          
        console.log(subscription_details, subscription_pilot);
      } catch (error) {
        console.error('Error fetching subscription prices:', error);
      } finally {
        setLoading(false);
      }
    };

    getSubscriptionPrices();
  }, []);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.subscription) {
      router.push('/dashboard');
    }
  }, [session, status, router]);

  const handleSignup = async () => {
    setPriceId(subscription.id);
    setCustomerId(session?.user?.id);
    router.push('/subscription-checkout');
  };

  const SubscriptionDisplay = () => {
    if (loading) {
      return (
        <div className="w-lg h-lg m-auto">
          <Loading />
        </div>
      );
    }

    if (!subscription) {
      return (
        <div className="text-center">
          No Subscription information available. Please proceed to the dashboard.
        </div>
      );
    }
 
    const { nickname: name, tiers } = subscription;

    if (name === 'pilot-program') {
      return (
        <div className="p-4 bg-gray-50 rounded shadow">
          <h2 className="font-bold text-dark-blue text-xl">Pilot Program</h2>
          <p className="text-sm text-gray-500 mt-2">
            Enjoy free reports during the current phase of our Pilot Program. 
          </p>
          <p className="text-sm text-gray-500">
            Payment information will be collected, but you won’t be charged at this time.
          </p>
        </div>
      );
    } else {
      return (
        <div className="p-4 bg-gray-50 rounded shadow">
          <h2 className="font-bold text-dark-blue text-lg">
            Start Your Subscription Today!
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            With a subscription, you can access our comprehensive report ordering and management system.
          </p>
          <p className="text-sm text-gray-600">
            Subscriptions are billed at the end of the cycle. Charges are based on the number of reports ordered, with no up-front costs.
          </p>
          <p className="text-sm text-gray-600 mt-4 font-medium">Graduated Pricing:</p>
          <div className="mt-2">
            {tiers && tiers.length > 0 ? (
              tiers.map((tier, index) => (
                <div key={index} className="flex justify-between text-sm text-gray-700 border-b py-2">
                  <span>
                    Up to {tier.up_to ? `${tier.up_to} reports` : 'unlimited reports'}
                  </span>
                  <span>${(tier.unit_amount / 100).toFixed(2)} per report</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No pricing tiers available.</p>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Without a subscription, you can still view existing reports but will not be able to order new ones.
          </p>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col gap-y-4 text-black">
      <div className="max-w-3xl">
        <div className="">
        <div className="text-2xl font-semibold mb-4">Subscription Sign Up</div>              
          <SubscriptionDisplay />
            
          <button
            className="bg-medium-brown text-white w-full py-2 rounded-md hover:opacity-75 mt-4"
            onClick={handleSignup}
          >
            Start Subscription
          </button>
          <Link
            href="/dashboard"
            className="text-black underline hover:text-medium-brown mt-2 block text-sm text-center"
          >
            Start Subscription Later
          </Link>
        </div>
      </div>
    </div>
  );
}
