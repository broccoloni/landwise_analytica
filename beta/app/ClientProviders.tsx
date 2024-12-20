'use client';

import { ReactNode } from 'react';
import { SessionProvider as NextAuthProvider } from 'next-auth/react';
import { ReportProvider } from '@/contexts/ReportContext';

interface ClientProvidersProps {
  children: ReactNode;
}

const ClientProviders = ({ children }: ClientProvidersProps) => {
  return (
    <ReportProvider>
      <NextAuthProvider>
        {children}
      </NextAuthProvider>
    </ReportProvider>
  );
};

export default ClientProviders;
