'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Loading from '@/components/Loading';
import ReportBar from '@/components/ReportBar';

export default function ViewReports() {
  const { data: session, status } = useSession();
    
  const [loadingReports, setLoadingReports] = useState(false);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchReports(session.user.id);
    }
  }, [status]);

  const fetchReports = async (sessionOrCustomerId: string) => {
    setLoadingReports(true);
    try {
      const response = await fetch('/api/getReportIds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionOrCustomerId }),
      });      
      
      const data = await response.json();
      console.log(data);
      setReports(data.reports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoadingReports(false);
    }
  };
    
  return (
    <div>
      <h2 className="text-2xl mb-4">Your Reports</h2>
      {loadingReports ? (
        <Loading />
      ) : (
        <div className="space-y-4">
          {!reports || reports.length === 0 ? (
            <p>No reports found. Order a new report to get started!</p>
          ) : (
            reports.map((report) => (
              <div key={report.reportId} className="">
                <ReportBar report={report} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}