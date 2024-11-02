import Header from '@/components/Header';
import ScrollToTop from '@/components/ScrollToTop';

export default function Screen({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    
  return (
    <div className="h-screen min-h-screen text-white w-auto bg-accent-light">
      <Header />
      <div className="mx-auto">
          {children}
      </div>
      <ScrollToTop />
    </div>
  );
}





