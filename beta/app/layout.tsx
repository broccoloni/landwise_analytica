import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ReportProvider } from '@/contexts/ReportContext';

import '@/ui/globals.css';

export const metadata = {
  title: 'Landwise Analytica',
  description: 'Landwise Analytica Website',
  icons: {
    icon: '/favicon.svg'
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    
  return (
    <html lang="en">
      <body className="h-full">
        <div className="min-h-screen w-full flex flex-col">
          <Header />
            
          <main className="flex-1 bg-light-brown text-black">
            <ReportProvider>
              {children}
            </ReportProvider>
          </main>
            
          <Footer />
        </div>
      </body>
    </html>
  );
}
