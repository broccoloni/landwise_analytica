import Header from '@/components/Header';
import ScrollToTop from '@/components/ScrollToTop';
import '@/ui/globals.css';

export default function SampleReportLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    
  return (
    <div className="text-black w-full">
      <div className="px-20">
        {children}
      </div>
      <ScrollToTop />
    </div>
  );
}
