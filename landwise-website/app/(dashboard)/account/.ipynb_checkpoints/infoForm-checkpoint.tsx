import { useSession } from 'next-auth/react';
import { useState } from 'react';
import NotificationBanner from '@/components/NotificationBanner';

export default function InfoForm() {
  const { data: session, update } = useSession();
  const [formData, setFormData] = useState({
    firstName: session?.user?.firstName || '',
    lastName: session?.user?.lastName || '',
    email: session?.user?.email || '',
    realtyGroup: session?.user?.realtyGroup || '',
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/updateUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: session?.user?.id,
        updates: formData,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      setSuccessMessage('User details updated successfully!');
      setErrorMessage(null);

      if (update && session?.user) {
        const newSession = { ...session.user, ...formData };
        update(newSession);
      }
    } else {
      setErrorMessage(result.message || 'Failed to update user.');
      setSuccessMessage(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Edit Account Details</h2>

      {successMessage && (
        <div className="mb-4">
          <NotificationBanner type='success'>{successMessage}</NotificationBanner>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4">
          <NotificationBanner type='error'>{errorMessage}</NotificationBanner>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-white">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border border-gray-300 focus:border-medium-brown focus:ring-medium-brown dark:text-black"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-white">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border border-gray-300 focus:border-medium-brown focus:ring-medium-brown dark:text-black"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border border-gray-300 focus:border-medium-brown focus:ring-medium-brown dark:text-black"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="realtyGroup" className="block text-sm font-medium text-gray-700 dark:text-white">Realty Group</label>
          <input
            type="text"
            id="realtyGroup"
            name="realtyGroup"
            value={formData.realtyGroup}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border border-gray-300 focus:border-medium-brown focus:ring-medium-brown dark:text-black"
          />
        </div>
        <button
          type="submit"
          className="bg-medium-brown dark:bg-medium-green text-white px-4 py-2 rounded-md hover:opacity-75"
        >
          Update Details
        </button>
      </form>
    </div>
  );
}
