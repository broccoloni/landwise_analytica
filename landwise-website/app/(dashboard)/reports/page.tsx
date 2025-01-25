'use client';

import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { NotebookText, ClipboardPlus, DollarSign } from 'lucide-react';
import Container from '@/components/Container';
import ViewReports from './viewReports';
import NewReport from './newReport';
import Pricing from './pricing';
import { useReportContext } from '@/contexts/ReportContext';
import { useCartContext } from '@/contexts/CartContext';

export default function ReportsPage() {
  const { clearReportContext } = useReportContext();
  const { data: session, status } = useSession();
  const { setSessionId } = useCartContext();
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedTab = searchParams.get('tab') || 'view-reports';

  const handleTabChange = (tab) => {
    router.push(`?tab=${tab}`);
    if (tab === 'view-reports') {
      setSessionId(null);
    } else if (tab === 'new-report') {
      clearReportContext();
    }
  };

  return (
    <div className="px-10 sm:px-20 md:px-40 py-10 bg-light-brown min-h-lg">
      <Container className="flex bg-white">
        {/* Sidebar Navigation */}
        <div className="w-1/4 px-4 py-8 border-r border-gray-200">
          <div className="text-2xl mb-4">Reports</div>
          <ul className="space-y-2">
            <li
              className={`flex items-center cursor-pointer rounded-md px-4 py-2 hover:bg-medium-brown hover:opacity-75 hover:text-white
              ${selectedTab === 'view-reports' ? 'bg-medium-brown text-white' : ''}`}
              onClick={() => handleTabChange('view-reports')}
            >
              <NotebookText className="h-5 w-5 mr-2" /> View Reports
            </li>
            <li
              className={`flex items-center cursor-pointer rounded-md px-4 py-2 hover:bg-medium-brown hover:opacity-75 hover:text-white
              ${selectedTab === 'new-report' ? 'bg-medium-brown text-white' : ''}`}
              onClick={() => handleTabChange('new-report')}
            >
              <ClipboardPlus className="h-5 w-5 mr-2" /> Order New Reports
            </li>
            <li
              className={`flex items-center cursor-pointer rounded-md px-4 py-2 hover:bg-medium-brown hover:opacity-75 hover:text-white
              ${selectedTab === 'pricing' ? 'bg-medium-brown text-white' : ''}`}
              onClick={() => handleTabChange('pricing')}
            >
              <DollarSign className="h-5 w-5 mr-2" /> Pricing
            </li>
          </ul>
        </div>

        {/* Content Area */}
        <div className="w-3/4 px-8 py-8">
          {selectedTab === 'view-reports' && <ViewReports />}
          {selectedTab === 'new-report' && <NewReport />}
          {selectedTab === 'pricing' && <Pricing />}
        </div>
      </Container>
    </div>
  );
}
