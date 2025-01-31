import { GoogleTagManager } from '@next/third-parties/google'
import { ReactNode } from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClientProviders from './ClientProviders';
import '@/ui/globals.css';
import { roboto } from '@/ui/fonts';

export const metadata: Metadata = {
  title: 'Landwise Analytica',
  description: 'Landwise Analytica description',
  icons: {
    icon: '/favicon.svg',
  },
};

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''} />

      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body>
        <ClientProviders>
          <div className="min-h-screen flex flex-col">
            <Header />
          
            <main className={`${roboto.className} flex-1 bg-light-brown text-black dark:bg-dark-gray-d dark:text-white`}>
              {children}
            </main>
          
            <Footer />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}


