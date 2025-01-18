'use client';

import { useSession, signOut, signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Loading from '@/components/Loading';
import Container from '@/components/Container';
import { PartyPopper, CircleAlert, User, NotebookText, LayoutDashboard, Handshake, Infinity } from 'lucide-react';
import Link from 'next/link';
import InfoButton from '@/components/InfoButton';
import NotificationBanner from '@/components/NotificationBanner';
import { RealtorStatus } from '@/types/statuses';
import MonthlyReportsWidget from '@/components/MonthlyReportsWidget';
import ExpiringReportsWidget from '@/components/ExpiringReportsWidget';

export default function Dashboard() {
  const { data: session, status } = useSession();
    
  const [notification, setNotification] = useState('');
  const [notificationType, setNotificationType] = useState('info');
  useEffect(() => {
    if (session?.user?.status === RealtorStatus.Unverified) {
      setNotification("Please verify your email to purchase reports using this account");
    }
  }, [session?.user?.status]);

    
  if (status === 'loading') {
    return <div className="m-auto py-20 min-w-lg"><Loading /></div>;
  }

  if (status === 'unauthenticated') {
    return <div className="text-center">You need to log in to view this page.</div>;
  }

  const handleNewVerificationEmail = async () => {
    if (!session?.user?.email || !session?.user?.id) {
      console.error("User email or ID is missing.");
      return;
    }

    try {
      const response = await fetch('/api/sendVerificationEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          userId: session.user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error sending verification email:", data.message);
        setNotification(`Failed to send verification email: ${data.message}`);
        setNotificationType('error');
      } else {
        console.log("Verification email sent successfully:", data.message);
        setNotification("Verification email sent successfully!");
        setNotificationType('success');
      }
    } catch (error) {
      console.error("An error occurred while sending the verification email:", error);
      setNotification("An error occurred. Please try again later.");
      setNotificationType('error');
    }
  };

    
  return (
    <div className="px-10 sm:px-20 md:px-40 py-10 bg-light-brown">
      {notification && (
        <div className="mb-4">
          <NotificationBanner type={notificationType}>
            <div className="flex justify-between items-center mr-4">
              <div className="">{notification}</div>
              {notification === 'Please verify your email to purchase reports using this account' && (
                <button 
                  className="hover:underline px-4 py-2 rounded-md border border-blue-800"
                  onClick={handleNewVerificationEmail}
                >
                  Send New Link
                </button>
              )}
            </div>
          </NotificationBanner>
        </div>
      )}
      <Container className="bg-white">
        <div className="text-4xl mb-8 text-center">Dashboard</div>
        <div className="ml-4">
          <div className="flex items-center justify-center mb-8 text-lg">
            <PartyPopper className="h-6 w-6 mr-4" />
            Welcome to the pilot program!
          </div>
          <div className="flex items-center mb-4">
            <LayoutDashboard className="h-5 w-5 mx-4" />
            On this dashboard you'll recieve updates, notifications, and information about the reports you've ordered
          </div>
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 mx-4" />
            You can view and change your account information and settings as well as submit feedback under the
            <Link
              href="account"
              className="underline hover:text-medium-brown ml-1"
            >
              Account tab
            </Link>
          </div>
          <div className="flex items-center mb-4">
            <NotebookText className="h-5 w-5 mx-4" />
            You can view the reports you've ordered and order new ones from the
            <Link
              href="/reports"
              className="underline hover:text-medium-brown ml-1"
            >
              Reports tab
            </Link>
          </div>
          <div className="flex items-center">
            <Handshake className="h-5 w-5 mx-4" />
            The  
            <span className="mx-1 font-bold">First 3 Reports</span>
            of the pilot program are 
            <span className="ml-1 font-bold">Free</span>
          </div>
        </div>
      </Container>
      <div className="flex mt-8 space-x-8">
        <MonthlyReportsWidget />
        <ExpiringReportsWidget />
      </div>
        
    </div>
  );
}
