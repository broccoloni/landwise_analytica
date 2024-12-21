'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import InfoForm from './infoForm';
import PasswordForm from './passwordForm';
import SubscriptionForm from './subscriptionForm';
import { Pencil, LogOut, Lock, CreditCard } from 'lucide-react';
import Loading from '@/components/Loading';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [selectedTab, setSelectedTab] = useState('edit'); // Default to edit account details

  if (status === 'loading') {
    return <div><Loading /></div>;
  }

  if (status === 'unauthenticated') {
    return <div>You need to log in to view this page.</div>;
  }

  return (
    <div className="flex px-10 sm:px-20 md:px-40 py-10">
      <div className="w-1/4 px-4 py-8">
        <div className="text-2xl mb-4">Account Settings</div>
        <ul className="space-y-2">
          <li
            className={`flex items-center cursor-pointer rounded-md px-4 py-2 hover:bg-medium-brown hover:opacity-75 hover:text-white
              ${selectedTab === 'edit' ? 'bg-medium-brown text-white' : ''}`}
            onClick={() => setSelectedTab('edit')}
          >
            <Pencil className="mr-2" /> Edit Account Details
          </li>
          <li
            className={`flex items-center cursor-pointer rounded-md px-4 py-2 hover:bg-medium-brown hover:opacity-75 hover:text-white
              ${selectedTab === 'password' ? 'bg-medium-brown text-white' : ''}`}
            onClick={() => setSelectedTab('password')}
          >
            <Lock className="mr-2" /> Change Password
          </li>
          <li
            className={`flex items-center cursor-pointer rounded-md px-4 py-2 hover:bg-medium-brown hover:opacity-75 hover:text-white
              ${selectedTab === 'subscription' ? 'bg-medium-brown text-white' : ''}`}
            onClick={() => setSelectedTab('subscription')}
          >
            <CreditCard className="mr-2" /> Change Subscription
          </li>
          <li 
            className="flex items-center cursor-pointer px-4 py-2 rounded-md hover:bg-medium-brown hover:opacity-75 hover:text-white" 
            onClick={() => signOut()}
          >
            <LogOut className="mr-2" /> Sign Out
          </li>
        </ul>
      </div>
      <div className="w-3/4 px-8 py-8">
        {selectedTab === 'edit' && <InfoForm />}
        {selectedTab === 'password' && <PasswordForm />}
        {selectedTab === 'subscription' && <SubscriptionForm />}
      </div>
    </div>
  );
}
