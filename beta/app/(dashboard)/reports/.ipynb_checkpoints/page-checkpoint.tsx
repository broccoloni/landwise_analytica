'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { NotebookText, ClipboardPlus, Clock, LogOut } from 'lucide-react';
import Loading from '@/components/Loading';
import Container from '@/components/Container';

export default function ReportsPage() {
  const { data: session, status } = useSession();
  const [selectedTab, setSelectedTab] = useState('view');
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchReports();
    }
  }, [status]);

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const response = await fetch('/api/reports'); // Adjust endpoint as necessary
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoadingReports(false);
    }
  };

  if (status === 'loading') {
    return <div><Loading /></div>;
  }

  if (status === 'unauthenticated') {
    return <div>You need to log in to view this page.</div>;
  }

  return (
    <div className="px-10 sm:px-20 md:px-40 py-10 bg-light-gray">
      <Container className="flex bg-gray-50">
        <div className="w-1/4 px-4 py-8 border-r border-gray-200">
          <div className="text-2xl mb-4">Reports</div>
          <ul className="space-y-2">
            <li
              className={`flex items-center cursor-pointer rounded-md px-4 py-2 hover:bg-medium-brown hover:opacity-75 hover:text-white
              ${selectedTab === 'view' ? 'bg-medium-brown text-white' : ''}`}
              onClick={() => setSelectedTab('view')}
            >
              <NotebookText className="h-5 w-5 mr-2" /> View Reports
            </li>
            <li
              className={`flex items-center cursor-pointer rounded-md px-4 py-2 hover:bg-medium-brown hover:opacity-75 hover:text-white
              ${selectedTab === 'order' ? 'bg-medium-brown text-white' : ''}`}
              onClick={() => setSelectedTab('order')}
            >
              <ClipboardPlus className="h-5 w-5 mr-2" /> Order New Reports
            </li>
          </ul>
        </div>
        <div className="w-3/4 px-8 py-8">
          {selectedTab === 'view' && (
            <div>
              <h2 className="text-2xl mb-4">Your Reports</h2>
              {loadingReports ? (
                <Loading />
              ) : (
                <div className="space-y-4">
                  {reports.length === 0 ? (
                    <p>No reports found. Order a new report to get started!</p>
                  ) : (
                    reports.map((report) => (
                      <div key={report.id} className="p-4 bg-white shadow rounded-md">
                        <h3 className="font-semibold">{report.title}</h3>
                        <p>Ordered on: {new Date(report.orderedAt).toLocaleDateString()}</p>
                        <p>Expires on: {new Date(report.expiryDate).toLocaleDateString()}</p>
                        {new Date(report.expiryDate) < new Date() && (
                          <p className="text-red-500 font-semibold">This report has expired.</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
          {selectedTab === 'order' && (
            <div>
              <h2 className="text-2xl mb-4">Order New Report</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Order functionality coming soon!');
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block mb-2 font-medium">Report Type</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option>Property Evaluation</option>
                    <option>Market Trends</option>
                    <option>Custom Report</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-medium-brown text-white px-4 py-2 rounded-md hover:opacity-75"
                >
                  Submit Order
                </button>
              </form>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
