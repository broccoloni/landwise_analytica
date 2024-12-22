'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function ViewReports() {
  const { data: session } = useSession();
    
  const [loadingReports, setLoadingReports] = useState(false);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchReports();
    }
  }, [status]);

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const response = await fetch('/api/reports');
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

    
  return (
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
  );
}