'use client';

import { roboto } from '@/ui/fonts';
import { useReportContext } from '@/contexts/ReportContext';
import { useEffect, useState } from 'react';

export default function CheckoutComplete() {
  const reportContext = useReportContext();

  const [reportIds, setReportIds] = useState([]);

  // Function to fetch report IDs from the API
  const fetchReportIds = async (sessionOrCustomerId) => {
    try {
      const response = await fetch('/api/getReportIds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionOrCustomerId }),
      });

      const result = await response.json();
      if (result.success) {
        setReportIds(result.reportIds);
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
    console.log("Session ID:", sessionId);
    if (sessionId) {
      fetchReportIds(sessionId);
    }
  }, []);

  return (
    <div className={`${roboto.className} px-40 py-20`}>
      <div className="text-2xl text-center mb-12 font-bold">
        Thank You For Your Purchase!
      </div>
      <div>
        <div className="text-xl">
          {reportIds.length > 0 ? (
            <ul>
              {reportIds.map((id) => (
                <li key={id} className="my-2">
                  Report ID: {id}
                </li>
              ))}
            </ul>
          ) : (
            <p>Loading report IDs...</p>
          )}
        </div>
        {reportContext.address ? (
          <div className="my-4">
            <p>Your report for <strong>{reportContext.address}</strong> may take a few minutes to process.</p>
          </div>
        ) : (
          <div className="my-4">No address provided.</div>
        )}
      </div>
    </div>
  );
}
