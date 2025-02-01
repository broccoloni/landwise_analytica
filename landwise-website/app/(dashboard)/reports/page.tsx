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
import Dropdown from '@/components/Dropdown';
import { toTitleCase } from '@/utils/string';

export default function ReportsPage() {
  const { clearReportContext } = useReportContext();
  const { data: session, status } = useSession();
  const { setSessionId } = useCartContext();

  const [selectedTab, setSelectedTab] = useState<'View Reports' | 'New Report' | 'Pricing'>('View Reports');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab') as 'View Reports' | 'New Report' | 'Pricing';

    if (tab) {
      setSelectedTab(tab);
    }
    else {
      handleTabChange('View Reports');
    }
  }, []);

  const handleTabChange = (tab: 'View Reports' | 'New Report' | 'Pricing') => {
    const path = tab.toLowerCase().replace(' ','-');
      
    setSelectedTab(path);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', path);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
    clearReportContext();
    setSessionId(null);
  };

  return (      
    <div className="px-10 sm:px-20 md:px-30 lg:px-40 py-10 bg-light-brown min-h-lg dark:bg-dark-gray-d">
      <Container className="flex-row lg:flex bg-white dark:bg-dark-gray-c">
        {/* Navigation */}
        <div className="w-full lg:w-1/4 px-0 md:px-4 py-0 lg:py-8 border-gray-200 border-b lg:border-b-0 lg:border-r">
          <div className="text-2xl mb-4">Reports</div>
          {/* Mobile dropdown display */}
          <div className="sm:hidden mb-4">
            <div className="mb-4 flex justify-center">
              <Dropdown
                options={['View Reports','New Report', 'Pricing']}
                selected={toTitleCase(selectedTab.replace('-',' '))}
                onSelect={(selected) => handleTabChange(selected)}
                className="px-auto"
              />
            </div>
          </div>

          {/* Tablet / Desktop display */}
          <div className="hidden sm:grid grid-cols-3 lg:grid-cols-1 mb-4 w-full space-y-2">
            <div
              className={`flex items-center cursor-pointer rounded-md px-4 py-2 hover:bg-medium-brown hover:opacity-75 hover:text-white
              ${selectedTab === 'view-reports' ? 'bg-medium-brown text-white dark:bg-medium-green' : ''}
              dark:hover:bg-medium-green
              `}
              onClick={() => handleTabChange('View Reports')}
            >
              <NotebookText className="h-5 w-5 mr-2" /> View Reports
            </div>
            <div
              className={`flex items-center cursor-pointer rounded-md px-4 py-2 hover:bg-medium-brown hover:opacity-75 hover:text-white
              ${selectedTab === 'new-report' ? 'bg-medium-brown text-white dark:bg-medium-green' : ''}
              dark:hover:bg-medium-green
              `}
              onClick={() => handleTabChange('New Report')}
            >
              <ClipboardPlus className="h-5 w-5 mr-2" /> Order New Reports
            </div>
            <div
              className={`flex items-center cursor-pointer rounded-md px-4 py-2 hover:bg-medium-brown hover:opacity-75 hover:text-white
              ${selectedTab === 'pricing' ? 'bg-medium-brown text-white dark:bg-medium-green' : ''}
              dark:hover:bg-medium-green
              `}
              onClick={() => handleTabChange('Pricing')}
            >
              <DollarSign className="h-5 w-5 mr-2" /> Pricing
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full lg:w-3/4 px-0 md:px-8 py-8">
          {selectedTab === 'view-reports' && <ViewReports />}
          {selectedTab === 'new-report' && <NewReport />}
          {selectedTab === 'pricing' && <Pricing />}
        </div>
      </Container>
    </div>
  );
}
