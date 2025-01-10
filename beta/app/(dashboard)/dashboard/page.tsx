'use client';

import { useSession, signOut, signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Loading from '@/components/Loading';
import Container from '@/components/Container';
import { PartyPopper, CircleAlert, User, NotebookText, LayoutDashboard, Handshake, Infinity } from 'lucide-react';
import Link from 'next/link';
import InfoButton from '@/components/InfoButton';

export default function Dashboard() {
  const { data: session, status } = useSession();

  useEffect(() => {
    const checkAndRefreshSession = async () => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const sessionId = urlParams.get('session_id');
      if (sessionId) {
        await signIn('credentials', { redirect: false }); // Refresh session silently
      }
    };

    checkAndRefreshSession();
  }, []);

    
  const notification = "";

  if (status === 'loading') {
    return <div><Loading /></div>;
  }

  if (status === 'unauthenticated') {
    return <div className="text-center">You need to log in to view this page.</div>;
  }

  return (
    <div className="px-10 sm:px-20 md:px-40 py-10 bg-light-brown">
      {notification && (
        <Container className="mb-4 bg-blue-50 text-blue-800">
          <div className="flex justify-start items-center">
            <CircleAlert className="h-10 w-10 mr-8" />
            <div className="">{notification}</div>
          </div>
        </Container>
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
            You can view and change your account and subscription information under the 
            <Link
              href="account"
              className="underline hover:text-medium-brown ml-1"
            >
              Account tab
            </Link>
          </div>
          <div className="flex items-center mb-4">
            <NotebookText className="h-5 w-5 mx-4" />
            You can view and order reports under the 
            <Link
              href="/reports"
              className="underline hover:text-medium-brown ml-1"
            >
              Reports tab
            </Link>
          </div>
          <div className="flex items-center">
            <Handshake className="h-5 w-5 mx-4" />
            Reports for the pilot program are currently 
            <span className="ml-1 font-bold">Free</span>
          </div>
        </div>
      </Container>
      <div className="flex mt-8 space-x-8">
        <Container className="bg-white w-full">
          <div className="flex justify-between items-center text-xl">
            Reports Ordered This Cycle
            <InfoButton>
              <div className="text-center text-lg">Reports Ordered</div>
              <div className="text-sm">
                Once the Pilot Program has ended, we will implement a subscription-based system. Subscriptions at different price-points will be offered featuring varying numbers of reports included per subscription-cycle, with additional reports charged at the same rate.
              </div>
            </InfoButton>
          </div>          <div className="flex text-4xl justify-center items-center p-4">
            <div className="mb-4 mr-2">0</div> 
            <div className="my-2">/</div>
            <Infinity className="h-10 w-10 ml-1 mt-4" />
          </div>
        </Container>
        <Container className="bg-white w-full">
          <div className="flex justify-between items-center text-xl">
            Reports Expiring Soon
            <InfoButton>
              <div className="text-center text-lg">Report Expiration</div>
              <div className="text-sm">
                Once ordered, reports expire after 180 days. To continue viewing your report, you can download a PDF. If you prefer the dynamic display provided on our website, you can also download the report in JSON format, and upload the data for viewing 
                <span className="underline hover:text-medium-brown ml-1">here</span>.
              </div>
            </InfoButton>
          </div>
          <div className="flex text-4xl justify-center items-center p-4">
            <div className="mb-4 mr-2">0</div> 
            <div className="my-2">/</div>
            <div className="mt-4 ml-2">0</div>
          </div>
        </Container>
      </div>
        
    </div>
  );
}
