'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
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

  const [selectedTab, setSelectedTab] = useState<'view-reports' | 'new-report' | 'pricing'>('view-reports');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab') as 'view-reports' | 'new-report' | 'pricing';

    if (tab) {
      setSelectedTab(tab);
    }
  }, []);

  const handleTabChange = (tab: 'view-reports' | 'new-report' | 'pricing') => {
    setSelectedTab(tab);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tab);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
    clearReportContext();
    setSessionId(null);
  };

  return (      
    <div className="px-10 sm:px-20 md:px-40 py-10 bg-light-brown min-h-lg dark:bg-dark-gray-d">
      <Container className="flex bg-white dark:bg-dark-gray-c">
        {/* Sidebar Navigation */}
        <div className="w-1/4 px-4 py-8 border-r border-gray-200">
          <div className="text-2xl mb-4">Reports</div>
          <ul className="space-y-2">
            <li
              className={`flex items-center cursor-pointer rounded-md px-4 py-2 hover:bg-medium-brown hover:opacity-75 hover:text-white
              ${selectedTab === 'view-reports' ? 'bg-medium-brown text-white dark:bg-medium-green' : ''}
              dark:hover:bg-medium-green
              `}
              onClick={() => handleTabChange('view-reports')}
            >
              <NotebookText className="h-5 w-5 mr-2" /> View Reports
            </li>
            <li
              className={`flex items-center cursor-pointer rounded-md px-4 py-2 hover:bg-medium-brown hover:opacity-75 hover:text-white
              ${selectedTab === 'new-report' ? 'bg-medium-brown text-white dark:bg-medium-green' : ''}
              dark:hover:bg-medium-green
              `}
              onClick={() => handleTabChange('new-report')}
            >
              <ClipboardPlus className="h-5 w-5 mr-2" /> Order New Reports
            </li>
            <li
              className={`flex items-center cursor-pointer rounded-md px-4 py-2 hover:bg-medium-brown hover:opacity-75 hover:text-white
              ${selectedTab === 'pricing' ? 'bg-medium-brown text-white dark:bg-medium-green' : ''}
              dark:hover:bg-medium-green
              `}
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
