'use client';

import { useState } from 'react';

export default function SubscriptionForm() {
  const [formData, setFormData] = useState({
    subscriptionType: 'basic', // default selection
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/account/change-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to change subscription');
      }

      alert('Subscription changed successfully');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Change Subscription</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="subscriptionType" className="block text-sm font-medium text-gray-700">Subscription Type</label>
          <select
            id="subscriptionType"
            name="subscriptionType"
            value={formData.subscriptionType}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2"
          >
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-medium-brown text-white px-4 py-2 rounded hover:opacity-75"
        >
          Change Subscription
        </button>
      </form>
    </div>
  );
}
