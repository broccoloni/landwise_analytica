import Head from 'next/head';
import Header from '@/components/Header';
import ScrollToTop from '@/components/ScrollToTop';
import '@/ui/globals.css';

export const metadata = {
  title: 'Landwise Analytica',
  description: 'Landwise Analytica Demo Website',
  icons: {
    icon: './favicon.svg'
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href={metadata.icons.icon} />
      </Head>
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
