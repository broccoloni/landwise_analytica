'use client';

import CheckoutSession from '@/components/CheckoutSession';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Loading from '@/components/Loading';
import ReportBar from '@/components/ReportBar';
import { useReportContext } from '@/contexts/ReportContext';
import { roboto, montserrat } from '@/ui/fonts';
import { useCartContext } from '@/contexts/CartContext';
import { fetchReportsBySessionId, redeemReport, isValidSize } from '@/utils/reports';
import { reportSizeLabels } from '@/types/reportSizes';

export default function Checkout() {
  // Note: Report details is too long to store in stripe metadata
  // Instead, we will generate the 3 reportIds the user buys,
  // and on the checkout-complete page, we will allow them to quickly
  // redeem the report with those details, which are still in the reportContext
  const router = useRouter();
  const [loadingReports, setLoadingReports] = useState(true);
  const { address, addressComponents, landGeometry, reportSize } = useReportContext();
  const { setQuantity, setCouponId, setCustomerId, sessionId, setSessionId } = useCartContext();

  const [reports, setReports] = useState<any[]>([]);
  const topRef = useRef<HTMLDivElement>(null);
    
  const handleComplete = (completedSessionId: string) => {
    console.log("(checkout) complete", completedSessionId);
    setQuantity(null);
    setCouponId(null);
    setCustomerId(null);
    setSessionId(completedSessionId);
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const fetchReports = async () => {
    if (!sessionId) {
      console.error("Session ID is null or undefined.");
      return;
    }
      
    try {
      const reports = await fetchReportsBySessionId(sessionId);
        
      if (reports.length > 0) {
        setReports(reports);
      }
    } catch (err) {
      console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } 
  };
    
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (reports.length === 0 && sessionId) {
        fetchReports();
      } else {
        clearInterval(intervalId); 
        setLoadingReports(false);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [reports, sessionId]);

  useEffect(() => {
    console.log(reports[0]?.reportId, address);
  }, [reports[0]?.reportId, address]);

  const handleRedeem = async () => {
    if (!reports[0]?.reportId || !address || !addressComponents || landGeometry.length < 3) {
      console.error('Required fields are missing or invalid.');
      return;
    }
      
    const result = await redeemReport({ 
      reportId: reports[0].reportId, 
      address: address, 
      addressComponents: addressComponents, 
      landGeometry: landGeometry,
    });
    if (result.success) {
      console.log('Report redeemed successfully');
      router.push(`/view-report/${reports[0].reportId}`);
    } else {
      console.error('Failed to redeem report:', result.message);
    }
  };
    
  return (
    <div className={`${roboto.className} px-10 sm:px-20 md:px-40 py-10 sm:py-20`} ref={topRef}>
      {sessionId ? (
        <div className="">
          <div className="text-2xl text-center mb-12 font-bold dark:text-medium-green">
            Thank You For Your Purchase!
          </div>
          <div className="mb-8 max-w-2xl mx-auto">You will be sent an email with these report IDs to be redeemed at any time. After being redeemed, you will have 180 days to view and download your report.</div>
          <div>
            <div className="text-xl">
              {reports.length > 0 ? (
                <ul key='report-list'>
                  {reports.map((report) => (
                    <li key={report.repordId} className="my-2 max-w-3xl mx-auto">
                      <ReportBar report={report} />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-20">
                  <Loading />
                </div>
              )}
            </div>
            {reports[0]?.reportId && address && addressComponents && landGeometry.length >= 3 && isValidSize(reportSize, reports[0]?.size) && (
              <div className="my-8 text-md max-w-2xl mx-auto">
                Redeem 
                <span className={`mx-2 ${montserrat.className}`}>{reports[0]?.reportId}</span> 
                with <strong className="mr-2">{address}</strong> 

                <span>
                  <button
                    className="hover:underline text-medium-green font-bold"
                    onClick={handleRedeem}
                  >
                    here
                  </button>
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <CheckoutSession onComplete={handleComplete} />
      )}
    </div>
  );
}
