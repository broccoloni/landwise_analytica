'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { NotebookText, ClipboardPlus, Clock, LogOut } from 'lucide-react';
import Loading from '@/components/Loading';
import Container from '@/components/Container';
import ViewReports from './viewReports';
import NewReport from './newReport';
import { useReportContext } from '@/contexts/ReportContext';

export default function ReportsPage() {
  const { clearReportContext } = useReportContext();
  const { data: session, status } = useSession();
  const [selectedTab, setSelectedTab] = useState('view-reports');

  return (
    <div className="px-10 sm:px-20 md:px-40 py-10 bg-light-brown">
      <Container className="flex bg-white">
        <div className="w-1/4 px-4 py-8 border-r border-gray-200">
          <div className="text-2xl mb-4">Reports</div>
          <ul className="space-y-2">
            <li
              className={`flex items-center cursor-pointer rounded-md px-4 py-2 hover:bg-medium-brown hover:opacity-75 hover:text-white
              ${selectedTab === 'view-reports' ? 'bg-medium-brown text-white' : ''}`}
              onClick={() => setSelectedTab('view-reports')}
            >
              <NotebookText className="h-5 w-5 mr-2" /> View Reports
            </li>
            <li
              className={`flex items-center cursor-pointer rounded-md px-4 py-2 hover:bg-medium-brown hover:opacity-75 hover:text-white
              ${selectedTab === 'new-report' ? 'bg-medium-brown text-white' : ''}`}
              onClick={() => {clearReportContext(); setSelectedTab('new-report') }}
            >
              <ClipboardPlus className="h-5 w-5 mr-2" /> Order New Reports
            </li>
          </ul>
        </div>
        <div className="w-3/4 px-8 py-8">
          {selectedTab === 'view-reports' && <ViewReports />}
          {selectedTab === 'new-report' && <NewReport />}
        </div>
      </Container>
    </div>
  );
}
