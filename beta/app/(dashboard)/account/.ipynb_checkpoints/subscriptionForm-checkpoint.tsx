'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function SubscriptionForm() {
  const { data: session } = useSession();

  const [subscriptionType, setSubscriptionType] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const price_1 = 1299.95;
  const price_5 = 999.95;
  const price_10 = 849.95;
  const price_20 = 699.95;
    
  const options = [
    { label: "1+ Reports / Month", 
      details: 
        <>
          <div className="flex justify-between w-56">
            <div>Rate:</div><div>${price_1.toFixed(2)} / Report</div>
          </div>
          <div className="flex justify-between w-56">
            <div>Min Charge:</div><div>${price_1.toFixed(2)} / Month</div>
          </div>            
        </> 
    },
    { label: "5+ Reports / Month", 
      details: 
        <>
          <div className="flex justify-between w-56">
            <div>Rate:</div><div>${price_5.toFixed(2)} / Report</div>
          </div>
          <div className="flex justify-between w-56">
            <div>Min Charge:</div><div>${(price_5 * 5).toFixed(2)} / Month</div>
          </div>  
          <div className="flex justify-between w-56">
            <div>Discount:</div><div>{((price_1 - price_5)/price_1 * 100).toFixed(0)}% off</div>
          </div>  
        </> 
    },
    { label: "10+ Reports / Month", 
      details: 
        <>
          <div className="flex justify-between w-56">
            <div>Rate:</div><div>${price_10.toFixed(2)} / Report</div>
          </div>
          <div className="flex justify-between w-56">
            <div>Min Charge:</div><div>${(price_10 * 10).toFixed(2)} / Month</div>
          </div>  
          <div className="flex justify-between w-56">
            <div>Discount:</div><div>{((price_1 - price_10)/price_1 * 100).toFixed(0)}% off</div>
          </div>  
        </> 
    },
    { label: "20+ Reports / Month", 
      details: 
        <>
          <div className="flex justify-between w-56">
            <div>Rate:</div><div>${price_20.toFixed(2)} / Report</div>
          </div>
          <div className="flex justify-between w-56">
            <div>Min Charge:</div><div>${(price_20 * 20).toFixed(2)} / Month</div>
          </div>  
          <div className="flex justify-between w-56">
            <div>Discount:</div><div>{((price_1 - price_20)/price_1 * 100).toFixed(0)}% off</div>
          </div>  
        </> 
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subscriptionType) {
      setSuccessMessage(null);
      setErrorMessage('Please select a subscription type');
      return;
    }

    try {
      const response = await fetch('/api/account/change-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionType }),
      });

      if (!response.ok) {
        throw new Error('Failed to change subscription');
      }

      setSuccessMessage('Subscription changed successfully');
      setErrorMessage(null);
    } catch (error: any) {
      setSuccessMessage(null);
      setErrorMessage(error.message);
    }
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

      {/* Success message */}
      {successMessage && (
        <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4">
          {successMessage}
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Radio buttons section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subscription Options
          </label>
          <div className="grid grid-cols-2 gap-4">
            {options.map((option, index) => (
              <div 
                key={index} 
                className={`flex p-4 items-center rounded-md border transition duration-200 hover:border-gray-500
                  ${option.label === subscriptionType ? 'border-black' : 'border-gray-300'}`}
              >
                <input
                  type="radio"
                  id={`subscription-${index}`}
                  name="subscriptionType"
                  value={option.label}
                  checked={subscriptionType === option.label}
                  onChange={(e) => setSubscriptionType(e.target.value)}
                  className="h-4 w-4 text-medium-brown focus:ring-medium-brown border-gray-300 mr-4"
                />
                <label htmlFor={`subscription-${index}`} className="w-full">
                  <span className="font-bold text-dark-blue text-center">{option.label}</span>
                  <div className="text-sm text-gray-500">{option.details}</div>
                </label>
              </div>
            ))}
          </div>
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
