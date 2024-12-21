import { ReactNode } from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClientProviders from './ClientProviders'; // Import the client-side provider
import '@/ui/globals.css';

export const metadata: Metadata = {
  title: 'Landwise Analytica',
  description: 'Landwise Analytica description',
};

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body>
        <ClientProviders>
          <div className="min-h-screen flex flex-col">
            <Header />
          
            <main className="flex-1 bg-light-brown text-black">
              {children}
            </main>
          
            <Footer />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}


