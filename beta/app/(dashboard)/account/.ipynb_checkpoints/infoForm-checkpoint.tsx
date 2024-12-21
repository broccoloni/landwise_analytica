'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function InfoForm() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    firstName: session?.user?.firstName || '',
    lastName: session?.user?.lastName || '',
    email: session?.user?.email || '',
    realtyGroup: session?.user?.realtyGroup || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/account/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update account details');
      }

      alert('Account details updated successfully');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Edit Account Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="realtyGroup" className="block text-sm font-medium text-gray-700">Realty Group</label>
          <input
            type="text"
            id="realtyGroup"
            name="realtyGroup"
            value={formData.realtyGroup}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2"
          />
        </div>
        <button
          type="submit"
          className="bg-medium-brown text-white px-4 py-2 rounded-md hover:opacity-75"
        >
          Update Details
        </button>
      </form>
    </div>
  );
}
