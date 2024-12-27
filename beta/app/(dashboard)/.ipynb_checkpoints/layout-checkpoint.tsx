'use client';

import { useSession } from 'next-auth/react';
import { merriweather, raleway } from '@/ui/fonts';
import { useEffect, useState } from 'react';
import SubHeader from '@/components/SubHeader';
// import { useSearchParams } from 'next/navigation';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    
  const {data, status} = useSession();

  return (
    <div className="text-black">
      <SubHeader />
      {children}
    </div>
  );
}