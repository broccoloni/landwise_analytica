'use client';

import { useState, useEffect } from 'react';
import { montserrat, roboto, merriweather, nunito, raleway } from '@/ui/fonts';
import Link from 'next/link';
import DropdownMenu from '@/components/DropdownMenu';
import { User, NotebookText, LogOut } from 'lucide-react';
import ListOfLinks from '@/components/ListOfLinks';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const SubHeader = () => {
  const { data: session, status } = useSession(); // Access session and status
  const router = useRouter();
    
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status]);


  useEffect(() => {
    console.log("(subheader) Status:", status);
    console.log("(subheader) Session:", session);
  }, [status, session]);
    
  return (
    <div className={`w-full text-white bg-dark-olive opacity-80 py-4 px-4 md:px-20 lg:px-36 ${raleway.className}`}>
      <div className="flex justify-between">
        {/* Left Side */}
        <div className="flex items-center space-x-8">
          <Link
            href={'/account'}
            className="text-sm text-white flex hover:underline"
          >
            <User className="h-5 w-5 mr-1" />
            My Account
          </Link>
            
          <Link
            href={'/reports'}
            className="text-sm text-white flex hover:underline"
          >
            <NotebookText className="h-5 w-5 mr-1" />
            My Reports
          </Link>
        </div>

        {/* Right Side */}
        <div className="">
          <button
            className="text-sm text-white flex hover:underline"
            onClick={() => signOut({callbackUrl: '/'})}
          >
            <LogOut className="h-5 w-5 mr-1" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubHeader;
