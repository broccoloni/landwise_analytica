'use client';

import { useSession, signOut } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import InfoForm from './infoForm';
import PasswordForm from './passwordForm';
import SettingsForm from './settingsForm';
import FeedbackForm from './feedbackForm';
import { Pencil, LogOut, Lock, Settings, MessageSquareMore } from 'lucide-react';
import Loading from '@/components/Loading';
import Container from '@/components/Container';
import { toTitleCase } from '@/utils/string';
import Dropdown from '@/components/Dropdown';

export default function AccountPage() {
  const { data: session, status } = useSession();

  const [selectedTab, setSelectedTab] = useState<'Account Details' | 'Change Password' | 'Settings' | 'Feedback'>('Edit');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab') as 'Account Details' | 'Change Password' | 'Settings' | 'Feedback';

    if (tab) {
      setSelectedTab(tab);
    }
    else {
      handleTabChange('Account Details');
    }
  }, []);

  const handleTabChange = (tab: 'Account Details' | 'Change Password' | 'Settings' | 'Feedback') => {
    const path = tab.toLowerCase().replace(' ','-');
      
    setSelectedTab(path);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', path);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  };

  if (status === 'loading') {
    return <div className="m-auto py-20 min-w-lg"><Loading /></div>;
  }

  if (status === 'unauthenticated') {
    return <div className="text-center">You need to log in to view this page.</div>;
  }

  return (
    <div className="px-10 sm:px-20 md:px-30 lg:px-40 py-10 bg-light-brown min-h-lg dark:bg-dark-gray-d">
      <Container className="flex-row lg:flex bg-white dark:bg-dark-gray-c">
        {/* Navigation */}
        <div className="w-full lg:w-1/4 px-0 md:px-4 py-0 lg:py-8 border-gray-200 border-b lg:border-b-0 lg:border-r">
          <div className="text-2xl mb-4">Account</div>

          {/* Mobile dropdown display */}
          <div className="md:hidden mb-4">
            <div className="mb-4 flex justify-center">
              <Dropdown
                options={['Account Details', 'Change Password', 'Settings', 'Feedback']}
                selected={toTitleCase(selectedTab.replace('-',' '))}
                onSelect={(selected) => handleTabChange(selected)}
                className="px-auto"
              />
            </div>
          </div>
            
          {/* Tablet / Desktop display */}
          <div className="hidden md:grid grid-cols-5 lg:grid-cols-1 mb-4 space-y-2">
            <div
              className={`flex items-center cursor-pointer rounded-md px-4 py-2 hover:bg-medium-brown hover:opacity-75 hover:text-white
              ${selectedTab === 'account-details' ? 'bg-medium-brown text-white dark:bg-medium-green' : ''}
              dark:hover:bg-medium-green 
              `}
              onClick={() => handleTabChange('Account Details')}
            >
              <Pencil className="h-5 w-5 mr-2" /> Account Details
            </div>
            <div
              className={`flex items-center cursor-pointer rounded-md px-4 py-2 hover:bg-medium-brown hover:opacity-75 hover:text-white
              ${selectedTab === 'change-password' ? 'bg-medium-brown text-white dark:bg-medium-green' : ''}
              dark:hover:bg-medium-green 
              `}
              onClick={() => handleTabChange('Change Password')}
            >
              <Lock className="h-5 w-5 mr-2" /> Change Password
            </div>
            <div
              className={`flex items-center cursor-pointer rounded-md px-4 py-2 hover:bg-medium-brown hover:opacity-75 hover:text-white
              ${selectedTab === 'settings' ? 'bg-medium-brown text-white dark:bg-medium-green' : ''}
              dark:hover:bg-medium-green 
              `}
              onClick={() => handleTabChange('Settings')}
            >
              <Settings className="h-5 w-5 mr-2" /> Settings
            </div>
            <div
              className={`flex items-center cursor-pointer rounded-md px-4 py-2 hover:bg-medium-brown hover:opacity-75 hover:text-white
              ${selectedTab === 'feedback' ? 'bg-medium-brown text-white dark:bg-medium-green' : ''}
              dark:hover:bg-medium-green 
              `}
              onClick={() => handleTabChange('Feedback')}
            >
              <MessageSquareMore className="h-5 w-5 mr-2" /> Feedback
            </div>
            <div 
              className="flex items-center cursor-pointer px-4 py-2 rounded-md hover:bg-medium-brown hover:opacity-75 dark:hover:bg-medium-green  hover:text-white"
              onClick={() => signOut()}
            >
              <LogOut className="h-5 w-5 mr-2" /> Sign Out
            </div>
          </div>
        </div>
          
        {/* Content Area */}
        <div className="w-full lg:w-3/4 px-0 md:px-8 py-8">
          {selectedTab === 'account-details' && <InfoForm />}
          {selectedTab === 'change-password' && <PasswordForm />}
          {selectedTab === 'settings' && <SettingsForm />}
          {selectedTab === 'feedback' && <FeedbackForm />}
        </div>
      </Container>
    </div>
  );
}
