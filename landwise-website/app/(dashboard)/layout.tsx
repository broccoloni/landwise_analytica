'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    
  const {data, status} = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status]);

  return (
    <div className="">
      {children}
    </div>
  );
}