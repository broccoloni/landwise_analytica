'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import SubscriptionOption from '@/components/SubscriptionOption';
import { fetchSubscriptionPrices } from '@/utils/stripe';
import Loading from '@/components/Loading';
import { useRouter } from 'next/navigation';
import { useCartContext } from '@/contexts/CartContext';
import { SubscriptionStatus } from '@/types/statuses';
import { format } from 'date-fns';
import GraduatedPricingTable from '@/components/GraduatedPricingTable';

export default function SubscriptionForm() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { setPriceId, setCustomerId } = useCartContext();
  const [subscription, setSubscription] = useState<any>(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);
  const [subscriptionEvents, setSubscriptionEvents] = useState<any>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSubscriptionPrices = async () => {
      try {
        const prices = await fetchSubscriptionPrices();
        const { subscription: subscription_details, subscription_pilot } = prices;

        // setSubscription(subscription_details);
        setSubscription(subscription_pilot);
          
      } catch (error) {
        console.error('Error fetching subscription prices:', error);
      } finally {
        setSubscriptionLoading(false);
      }
    };

    getSubscriptionPrices();
  }, []);

  useEffect(() => {
    const fetchCurrentSubscription = async () => {
      if (session?.user?.subscription) {
        try {
          const response = await fetch('/api/getSubscriptionAndEvents', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subscriptionId: session.user.subscription, customerId: session.user.id }),
          });

          if (response.ok) {
            const data = await response.json();
              
            setSubscriptionDetails(data.subscription);
            setSubscriptionEvents(data.meterEventSummary.data[0]);
          } else {
            console.error('Failed to fetch current subscription:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching current subscription:', error);
        }
      }
    };

    if (!subscriptionLoading && session?.user) {
      fetchCurrentSubscription();
      setLoading(false);
    }
  }, [subscriptionLoading, session]);

  useEffect(() => {
    console.log("Subscription Details", subscriptionDetails);
    console.log("Subscription Events", subscriptionEvents);
    console.log("Subscription Option", subscription);
  },[subscriptionDetails, subscriptionEvents]);
    
  const handleSignup = async () => {
    setPriceId(subscription.id);
    setCustomerId(session?.user?.id);
    router.push('/subscription-checkout');
  };

  const handleCancel = async () => {
    try {
      const response = await fetch('/api/cancelSubscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId: session?.user?.subscription, customerId: session?.user?.id }),
      });

      if (response.ok) {
        console.log('Subscription cancelled successfully');
        if (update) {
          const newSession = { ...session.user, subscription: null, subscriptionStart: null, subscriptionStatus: SubscriptionStatus.Unsubscribed };
          update(newSession);
        }
      } else {
        console.error('Failed to cancel subscription:', response.statusText);
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    }
  };

  const ActiveSubscriptionDisplay = () => {
    const startDate = subscriptionDetails?.current_period_start
      ? format(new Date(subscriptionDetails.current_period_start * 1000), 'MMM dd, yyyy')
      : 'N/A';
    const endDate = subscriptionDetails?.current_period_end
      ? format(new Date(subscriptionDetails.current_period_end * 1000), 'MMM dd, yyyy')
      : 'N/A';

    // Calculate the estimated bill
    let estimatedBill = 0;
    let reportsOrdered = subscriptionEvents?.aggregated_value || 0;

    if (subscription?.tiers && reportsOrdered) {
      for (const tier of subscription.tiers) {
        if (tier.up_to === null || reportsOrdered <= tier.up_to) {
          estimatedBill += reportsOrdered * (tier.unit_amount / 100);
          break;
        } else {
          estimatedBill += tier.up_to * (tier.unit_amount / 100);
          reportsOrdered -= tier.up_to;
        }
      }
    }
      
    return (
      <div>
        <h2 className="font-bold text-lg text-dark-blue">
          Active Subscription {subscription.nickname === 'pilot-program' && ('- Pilot Program')}
        </h2>
        <div className="mt-4 mx-10 p-4 bg-gray-100 rounded">
          <div className="flex justify-between text-sm text-gray-600">
            <div className="font-bold">Status:</div>
            <div className="">{session?.user?.subscriptionStatus}</div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <div className="font-bold">Current Cycle:</div>
            <div className="">{startDate} - {endDate}</div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <div className="font-bold">Reports Ordered:</div>
            <div className="">{subscriptionEvents?.aggregated_value || 0}</div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <div className="font-bold">Estimated Bill (pre-tax):</div>
            <div className="">${estimatedBill.toFixed(2)}</div>
          </div>
        </div>
      </div>
    );
  }

    
  const SubscriptionDisplay = () => {
    if (loading) {
      return (
        <div className="p-20 m-auto">
          <Loading />
        </div>
      );
    }

    const curSubscriptionStatus = session?.user?.subscriptionStatus;
    // const curSubscriptionStatus = SubscriptionStatus.Unsubscribed;
      
    if (curSubscriptionStatus === SubscriptionStatus.Unsubscribed) {
      if (!subscription) {
        return (
          <div className="text-center">
            No Subscription information available. Please proceed to the dashboard.
          </div>
        );
      }

      const { nickname: name, tiers } = subscription;
      return (
          <div>
            <h2 className="font-bold text-dark-blue text-lg">
              Start Your Subscription Today!
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              With a subscription, you can access our comprehensive report ordering and management system.
            </p>
            <p className="text-sm text-gray-600">
              Subscriptions are billed at the end of the cycle. Charges are based on the number of reports ordered, with no up-front costs.
            </p>
            <div className="mt-6">
              <GraduatedPricingTable subscription = {subscription} />
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Without a subscription, you can still view existing reports but will not be able to order new ones.
            </p>
            <button
              className="bg-medium-brown text-white w-full py-2 rounded-md hover:opacity-75 mt-4"
              onClick={handleSignup}
            >
              Start Subscription
            </button>
          </div>
      );
    } 
    // Active Subscription Display
    else if (curSubscriptionStatus === SubscriptionStatus.Active) {
      return (
        <div>
          <ActiveSubscriptionDisplay />
          <div className="mt-6">
            <GraduatedPricingTable subscription = {subscription} />
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-600">
              Subscriptions are billed at the end of the cycle. Charges are based on the number of reports ordered, with no up-front costs.
            </p>
          </div>
            
          <button
            className="bg-medium-brown text-white w-full py-2 rounded-md hover:opacity-75 mt-6"
            onClick={handleCancel}
          >
            Cancel Subscription
          </button>
        </div>
      );
    }
  };

  return (
    <div>
      <div className="text-2xl mb-4">Subscription</div>

      <SubscriptionDisplay />
    </div>
  );
}
