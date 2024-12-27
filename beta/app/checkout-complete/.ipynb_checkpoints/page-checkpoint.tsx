'use client';

import { roboto, montserrat } from '@/ui/fonts';
import { useReportContext } from '@/contexts/ReportContext';
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import ReportBar from '@/components/ReportBar';

export default function CheckoutComplete() {
  const reportContext = useReportContext();

  const [reports, setReports] = useState([]);

  // Function to fetch report IDs from the API
  const fetchReports = async (sessionOrCustomerId) => {
    try {
      const response = await fetch('/api/getReportIds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionOrCustomerId }),
      });

      const result = await response.json();

      if (result.success) {
        setReports(result.reports);
      } else {
        console.error('Error retrieving report IDs:', result.message);
      }
    } catch (error) {
      console.error('Error fetching report IDs:', error);
    }
  };

  useEffect(() => {
    // Extract session_id from the URL query parameters
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');
    if (sessionId) {
      fetchReports(sessionId);
    }
  }, []);
    
  return (
    <div className={`${roboto.className} px-10 sm:px-20 md:px-40 py-10 sm:py-20`}>
      <div className="text-2xl text-center mb-12 font-bold">
        Thank You For Your Purchase!
      </div>
      <div className="mb-8 max-w-2xl mx-auto">You will be sent an email with these report IDs to be redeemed at any time. After being redeemed, you will have 180 days to view and download your report.</div>
      <div>
        <div className="text-xl">
          {reports.length > 0 ? (
            <ul>
              {reports.map((report) => (
                <li key={report.repordId} className="my-2 max-w-3xl mx-auto">
                  <ReportBar report={report} />
                </li>
              ))}
            </ul>
          ) : (
            <Loading className="h-5 w-5" />
          )}
        </div>
        {reportContext.address && reports.length > 0 ? (
          <div className="my-8 text-md">
            <div className="hover:underline hover:text-medium-brown max-w-2xl mx-auto">
              Redeem 
              <span className={`mx-2 ${montserrat.className}`}>{reports[0].id}</span> 
              with <strong className="mr-2">{reportContext.address}</strong> 
              here
            </div>
          </div>
        ): ( <></>)}
      </div>
    </div>
  );
}
