import '@/ui/globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Landwise Analytica</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
