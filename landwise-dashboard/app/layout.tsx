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
        {children}
      </body>
    </html>
  );
}
