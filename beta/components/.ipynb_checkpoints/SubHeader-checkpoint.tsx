'use client';

import { useState, useEffect } from 'react';
import { roboto, raleway } from '@/ui/fonts';
import Link from 'next/link';
import DropdownMenu from '@/components/DropdownMenu';
import { User, NotebookText, LogOut, LayoutDashboard } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

const SubHeader = () => {
  const { data: session, status } = useSession(); // Access session and status
  const router = useRouter();
  const pathname = usePathname(); // Get the current path

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status]);

  useEffect(() => {
    console.log("(subheader) Status:", status);
    console.log("(subheader) Session:", session);
  }, [status, session]);

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5 mr-1" /> },
    { href: '/account', label: 'My Account', icon: <User className="h-5 w-5 mr-1" /> },
    { href: '/reports', label: 'My Reports', icon: <NotebookText className="h-5 w-5 mr-1" /> },
  ];

  return (
    <div className={`w-full text-white bg-dark-olive opacity-80 py-4 px-4 md:px-20 lg:px-36 ${raleway.className}`}>
      <div className="flex justify-between">
        {/* Left Side */}
        <div className="flex items-center space-x-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm text-white flex rounded-md px-4 py-2 hover:underline ${
                pathname === link.href ? 'border border-white' : ''
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-8">
          {session?.user?.firstName && <div className="">Welcome, {session.user.firstName}</div>}
          <button
            className="text-sm text-white flex hover:underline"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut className="h-5 w-5 mr-1" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubHeader;
