// THIS COMPONENT IS NO LONGER USED AND IS ONLY HERE FOR REFERENCE

import React from 'react';

interface SubscriptionProps {
  subscription: any;
  basePrice: number;
  selectedSubscription: string;
  setSelectedSubscription: React.Dispatch<React.SetStateAction<string>>;
}

const SubscriptionOption: React.FC<SubscriptionProps> = ({
  subscription,
  basePrice,
  selectedSubscription,
  setSelectedSubscription,
}) => {
  const name = subscription.nickname;
    
  if (name === 'pilot-program' || name === 'no-subscription' || name === 'cancel-subscription') {
    return (
      <div
        key={`${subscription.nickname}-container`}
        className={`flex p-4 items-center rounded-md border transition duration-200 hover:border-gray-500
          ${subscription.nickname === selectedSubscription ? 'border-black' : 'border-gray-300'}`}
      >
        <input
          type="radio"
          id={subscription.nickname}
          name="subscription"
          value={subscription.nickname}
          checked={selectedSubscription === subscription.nickname}
          onChange={(e) => setSelectedSubscription(e.target.value)}
          className="h-4 w-4 text-medium-brown focus:ring-medium-brown border-gray-300 mr-4"
        />
        <label htmlFor={subscription.nickname} className="w-full">
          {name === 'pilot-program' ? (
            <div>
              <span className="font-bold text-dark-blue">Pilot Program</span>
              <div className="text-sm text-gray-500">Unlimited Free Reports</div>
            </div>
          ) : (
            <div>
              <span className="font-bold text-dark-blue">{name === 'no-subscription' ? 'Sign Up Later' : 'Cancel Subscription'}</span>
              <div className="text-sm text-gray-500">Change or cancel your subscription at any time </div>
            </div>
          )}
        </label>
      </div>
    );
  }

  const minQuantity = subscription.tiers ? subscription.tiers[0]['up_to'] : 0;
  const monthlyFee = subscription.tiers ? subscription.tiers[0]['flat_amount'] / 100 : 0;
  const reportFee = subscription.tiers ? subscription.tiers[1]['unit_amount'] / 100 : 0;
  const discount = minQuantity !== 0 ? Math.round((1 - monthlyFee / (minQuantity * basePrice)) * 100) : 0;
    
  return (
    <div
      key={`${subscription.nickname}-container`}
      className={`flex p-4 items-center rounded-md border transition duration-200 hover:border-gray-500
        ${subscription.nickname === selectedSubscription ? 'border-black' : 'border-gray-300'}`}
    >
      <input
        type="radio"
        id={subscription.nickname}
        name="subscriptionType"
        value={subscription.nickname}
        checked={selectedSubscription === subscription.nickname}
        onChange={(e) => setSelectedSubscription(e.target.value)}
        className="h-4 w-4 text-medium-brown focus:ring-medium-brown border-gray-300 mr-4"
      />
      <label htmlFor={subscription.nickname} className="w-full">
        <span className="font-bold text-dark-blue">{minQuantity}+ Reports / Month</span>
        <div className="text-sm text-gray-500">
          <div className="flex justify-between items-center">
            <div className="mr-2">Rate:</div>
            <div>${reportFee.toFixed(2)} / Report</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="mr-2">Min. Charge:</div>
            <div>${monthlyFee.toFixed(2)} / Month</div>
          </div>
          {discount > 0 && (
            <div className="flex justify-between items-center">
              <div className="mr-2">Discount:</div>
              <div>{discount}% off</div>
            </div>
          )}
        </div>
      </label>
    </div>
  );
};

export default SubscriptionOption;
