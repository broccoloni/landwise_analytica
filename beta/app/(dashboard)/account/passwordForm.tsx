'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import NotificationBanner from '@/components/NotificationBanner';

export default function PasswordForm() {
  const { data: session } = useSession();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
  const [formData, setFormData] = useState({
    email: session?.user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
    
  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setSuccessMessage(null);
      setErrorMessage("All fields must be filled");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setSuccessMessage(null);
      setErrorMessage("Passwords don't match");
      return;
    }
    if (formData.currentPassword === formData.newPassword) {
      setSuccessMessage(null);
      setErrorMessage("New password must be different from old password");
      return;
    }
    try {
      const response = await fetch('/api/updatePassword', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: session?.user?.id,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to change password');
      }

      setSuccessMessage('Password changed successfully');
      setErrorMessage(null);
    } catch (error) {
      setSuccessMessage(null);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unexpected error occurred');
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Change Password</h2>
        
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
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border border-gray-300 focus:border-medium-brown focus:ring-medium-brown"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border border-gray-300 focus:border-medium-brown focus:ring-medium-brown"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border border-gray-300 focus:border-medium-brown focus:ring-medium-brown"
          />
        </div>
        <button
          type="submit"
          className="bg-medium-brown text-white px-4 py-2 rounded-md hover:opacity-75"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}
