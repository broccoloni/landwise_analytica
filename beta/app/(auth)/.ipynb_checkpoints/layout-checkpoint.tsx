'use client';

import Container from '@/components/Container';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { merriweather, raleway } from '@/ui/fonts';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
    
  const {data, status} = useSession();

  useEffect(() => {
    if (status == 'authenticated' && data.user.email) {
      router.push('/dashboard');
    }
  }, [data, status]);

  const SignOut = () => {
    if (status == 'unauthenticated') {
      return;
    }

    return (
      <>
        {status === 'authenticated' && data?.user?.email ? (
          <p className={`${raleway.className} text-center text-sm text-black`}>
            Signed in as <span className="font-medium">
              {data.user.email}      
            </span>.{' '}
            <button
              className="rounded-none border-b border-black/20 p-0 text-sm text-dark-brown"
              onClick={() => signOut({callbackUrl: '/'})}
            >
              Sign out
            </button>
          </p>
        ) : ( 
          <></>
        )}
      </>
    );
  };

  return (
    <div className="py-4 sm:py-16">
      <div className="mx-auto flex max-w-[450px] flex-col gap-6 p-3 sm:gap-6">
        <Container className="no-scrollbar w-full rounded-xl px-5 py-5 bg-primary text-dark-brown">
          {children}
        </Container>
        <SignOut />
      </div>
    </div>
  );
}