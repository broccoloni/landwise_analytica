'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import InfoForm from './infoForm';
import PasswordForm from './passwordForm';
import SettingsForm from './settingsForm';
import FeedbackForm from './feedbackForm';
import Faqs from './faqs';
import { Pencil, LogOut, Lock, Settings, MessageSquareMore, CircleHelp } from 'lucide-react';
import Loading from '@/components/Loading';
import Container from '@/components/Container';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [selectedTab, setSelectedTab] = useState('edit');

  if (status === 'loading') {
    return <div className="m-auto py-20 min-w-lg"><Loading /></div>;
  }

  if (status === 'unauthenticated') {
    return <div className="text-center">You need to log in to view this page.</div>;
  }

  return (
    <div className="px-10 sm:px-20 md:px-40 py-10 bg-light-brown">
      <Container className="flex bg-white">
        <div className="w-1/4 px-4 py-8 border-r border-gray-200">
          <div className="text-2xl mb-4">Account Settings</div>
          <ul className="space-y-2">
            <li
              className={`flex items-center cursor-pointer rounded-md px-4 py-2 hover:bg-medium-brown hover:opacity-75 hover:text-white
              ${selectedTab === 'edit' ? 'bg-medium-brown text-white' : ''}`}
              onClick={() => setSelectedTab('edit')}
            >
              <Pencil className="h-5 w-5 mr-2" /> Account Details
            </li>
            <li
              className={`flex items-center cursor-pointer rounded-md px-4 py-2 hover:bg-medium-brown hover:opacity-75 hover:text-white
              ${selectedTab === 'password' ? 'bg-medium-brown text-white' : ''}`}
              onClick={() => setSelectedTab('password')}
            >
              <Lock className="h-5 w-5 mr-2" /> Change Password
            </li>
            <li
              className={`flex items-center cursor-pointer rounded-md px-4 py-2 hover:bg-medium-brown hover:opacity-75 hover:text-white
              ${selectedTab === 'settings' ? 'bg-medium-brown text-white' : ''}`}
              onClick={() => setSelectedTab('settings')}
            >
              <Settings className="h-5 w-5 mr-2" /> Settings
            </li>
            <li
              className={`flex items-center cursor-pointer rounded-md px-4 py-2 hover:bg-medium-brown hover:opacity-75 hover:text-white
              ${selectedTab === 'feedback' ? 'bg-medium-brown text-white' : ''}`}
              onClick={() => setSelectedTab('feedback')}
            >
              <MessageSquareMore className="h-5 w-5 mr-2" /> Feedback
            </li>
            <li
              className={`flex items-center cursor-pointer rounded-md px-4 py-2 hover:bg-medium-brown hover:opacity-75 hover:text-white
              ${selectedTab === 'faqs' ? 'bg-medium-brown text-white' : ''}`}
              onClick={() => setSelectedTab('faqs')}
            >
              <CircleHelp className="h-5 w-5 mr-2" /> FAQs
            </li>
            <li 
              className="flex items-center cursor-pointer px-4 py-2 rounded-md hover:bg-medium-brown hover:opacity-75 hover:text-white"
              onClick={() => signOut()}
            >
              <LogOut className="h-5 w-5 mr-2" /> Sign Out
            </li>
          </ul>
        </div>
        <div className="w-3/4 px-8 py-8">
          {selectedTab === 'edit' && <InfoForm />}
          {selectedTab === 'password' && <PasswordForm />}
          {selectedTab === 'settings' && <SettingsForm />}
          {selectedTab === 'feedback' && <FeedbackForm />}
          {selectedTab === 'faqs' && <Faqs />}            
        </div>
      </Container>
    </div>
  );
}
