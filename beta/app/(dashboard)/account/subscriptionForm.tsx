'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import SubscriptionOption from '@/components/SubscriptionOption';
import { fetchSubscriptionPrices } from '@/utils/stripe';
import Loading from '@/components/Loading';

export default function SubscriptionForm() {
  const { data: session } = useSession();
  const [subscriptions, setSubscriptions] = useState<any>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<string>('pilot-program');
  const [basePrice, setBasePrice] = useState(null);

  useEffect(() => {
    const getSubscriptionPrices = async () => {
      try {
        const prices = await fetchSubscriptionPrices();
          
        // const cancelSubscription = { nickname: 'cancel-subscription' };
        // setSubscriptions({ ...prices, cancelSubscription });
        // const { subscription_1 } = prices;
        // setBasePrice(subscription_1?.tiers[1]['unit_amount']/100);
          
        const { subscription_pilot } = prices;
        setSubscriptions({ subscription_pilot });
        setBasePrice(1299.95);
          
      } catch (err) {
        console.log(err.message);
      }
    };

    getSubscriptionPrices();
  }, []); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribing to", selectedSubscription);
  };

  return (
    <div className="">
      <div className="text-2xl mb-4">Change Subscription</div>

      <div className="flex">
        <div className="mr-4 mb-4">Current Subscription:</div>
        <div>{session?.user?.subscription ? session.user.subscription : 'None'}</div>
      </div>
      
      {/* Explanation Section */}
      <div className="mb-4 p-4 bg-blue-50 text-blue-800 rounded-md">
        <p>
          <strong>Important Information:</strong> Each subscription plan includes a minimum number of reports, and there is a minimum charge for those reports at the subscription rate. 
          For any reports above the minimum, they will be charged at the same subscription rate.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subscription Options
          </label>
          {subscriptions && basePrice ? (
            <div className={`grid grid-cols-1 gap-4 
              ${Object.keys(subscriptions).length > 1 && 'md:grid-cols-2'}`}
            >
              {Object.values(subscriptions).map((subscription) => (
                <SubscriptionOption
                  key={subscription.nickname}
                  subscription={subscription}
                  basePrice={basePrice}
                  selectedSubscription={selectedSubscription}
                  setSelectedSubscription={setSelectedSubscription}
                />
              ))}
            </div>
          ) : (
            <Loading />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-medium-brown text-white px-4 py-2 rounded-md hover:opacity-75 transition duration-200"
        >
          Change Subscription
        </button>
      </form>
    </div>
  );
}
