'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Loading from '@/components/Loading';
import ReportBar from '@/components/ReportBar';
import { useReportsByCustomerId } from "@/hooks/useReports";

export default function ViewReports() {
  const { data: session, status } = useSession();
    
  const { reports, isLoading, error } = useReportsByCustomerId(session?.user?.id || null);

  useEffect(() => {
    console.log("Reports:", reports);
  },[reports]);
    
  return (
    <div>
      <div className="hidden lg:block text-2xl mb-4">Your Reports</div>
      {isLoading ? (
        <div className="p-20">
          <Loading />
        </div>
      ) : (
        <div className="w-full space-y-4">
          {!reports || reports.length === 0 ? (
            <p>No reports found. Order a new report to get started!</p>
          ) : (
            reports.map((report) => (
              <div key={report.reportId} className="w-full">
                <ReportBar report={report} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}