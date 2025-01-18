'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Container from '@/components/Container';
import NotificationBanner from '@/components/NotificationBanner';
import { useSession } from 'next-auth/react';
import { RealtorStatus } from '@/types/statuses';

export default function VerifyEmailPage() {
  const { data: session, update, status } = useSession();
    
  const searchParams = useSearchParams();
  const [notification, setNotification] = useState('Verifying...');
  const [notificationType, setNotificationType] = useState('loading');
    
  const userId = searchParams.get('userId');
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyToken = async () => {
      if (!userId || !token) {
        setMessage('Invalid verification link.');
        return;
      }

      const response = await fetch(`/api/verifyEmail?userId=${userId}&token=${token}`);

      if (response.ok) {
        setNotificationType('success');
        // 200 - email verified, 201 - email already verified (doesn't actually use token)
        if (update && session?.user?.status === RealtorStatus.Unverified && response.status === 200) {
          console.log("Updating session with verified status");
          const newSession = { 
            ...session.user, 
            status: RealtorStatus.Active,
            emailVerificationToken: '',
            emailVerificationTokenExpires: '',
          };
          update(newSession);
        }
          
      }
      else {
        setNotificationType('error');
      }
        
      const data = await response.json();
      setNotification(data.message || 'Verification failed.');
    };

    if (status !== 'loading') {
      verifyToken();
    }
  }, [userId, token, status]);



  return (
    <div className="px-10 sm:px-20 md:px-40 py-10 bg-light-brown">
      <div className="max-w-sm mx-auto">
        <NotificationBanner type={notificationType}>{notification}</NotificationBanner>
      </div>
    </div>
  );
}
