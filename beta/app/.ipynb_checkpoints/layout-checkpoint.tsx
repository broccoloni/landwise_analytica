import Header from '@/components/Header';
import ScrollToTop from '@/components/ScrollToTop';
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
      <body>
        <div className="h-full min-h-screen text-white w-auto bg-accent-light">
          <Header />
          <div className="px-20 py-4">
            {children}
          </div>
          <ScrollToTop />
        </div>
      </body>
    </html>
  );
}
