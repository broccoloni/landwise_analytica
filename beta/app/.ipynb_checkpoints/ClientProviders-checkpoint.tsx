'use client';

import { ReactNode } from 'react';
import { SessionProvider as NextAuthProvider } from 'next-auth/react';
import { ReportProvider } from '@/contexts/ReportContext';
import { CartProvider } from '@/contexts/CartContext';

interface ClientProvidersProps {
  children: ReactNode;
}

const ClientProviders = ({ children }: ClientProvidersProps) => {
  return (
    <CartProvider>
      <ReportProvider>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </ReportProvider>
    </CartProvider>
  );
};

export default ClientProviders;
