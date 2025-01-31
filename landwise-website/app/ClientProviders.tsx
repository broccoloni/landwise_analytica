'use client';

import { ReactNode } from 'react';
import { SessionProvider as NextAuthProvider } from 'next-auth/react';
import { ReportProvider } from '@/contexts/ReportContext';
import { CartProvider } from '@/contexts/CartContext';
import { GoogleMapsProvider } from '@/contexts/GoogleMapsContext';
import { SettingsProvider } from '@/contexts/settings/SettingsProvider';

interface ClientProvidersProps {
  children: ReactNode;
}

const ClientProviders = ({ children }: ClientProvidersProps) => {
  return (
    <NextAuthProvider>
      <SettingsProvider>
        <CartProvider>
          <ReportProvider>
            <GoogleMapsProvider>
              {children}
            </GoogleMapsProvider>
          </ReportProvider>
        </CartProvider>
      </SettingsProvider>
    </NextAuthProvider>
  );
};

export default ClientProviders;
