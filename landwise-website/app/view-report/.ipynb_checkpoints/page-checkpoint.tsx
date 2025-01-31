'use client';

import { useState } from 'react';
import { montserrat, roboto, merriweather, raleway } from '@/ui/fonts';
import { ReportStatus } from '@/types/statuses'; 
import Loading from '@/components/Loading';
import { useReportContext } from '@/contexts/ReportContext';
import Link from 'next/link';
import { NotebookText, Check, X, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { fetchReportsById } from '@/utils/reports';
import NotificationBanner from '@/components/NotificationBanner';

export default function Terms() {
  const router = useRouter();
  const [validatingReportId, setValidatingReportId] = useState(false);
  const { 
    reportId, setReportId, 
    address, setAddress, 
    latitude, setLatitude, 
    longitude, setLongitude, 
    landGeometry, setLandGeometry, 
    addressComponents, setAddressComponents,
    status, setStatus,
  } = useReportContext();
    
  const handleReportIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); // Only allow uppercase letters and numbers

    const inputEvent = e.nativeEvent as InputEvent;

    if (value.length > 3 && !(inputEvent.inputType === 'deleteContentBackward' && value.length === 4)) {
      value = value.slice(0, 4) + '-' + value.slice(4);
    }
    if (value.length > 8 && !(inputEvent.inputType === 'deleteContentBackward' && value.length === 9)) {
      value = value.slice(0, 9) + '-' + value.slice(9);
    }

    setReportId(value);
    if (status !== null) setStatus(null);
  };


  const handleSubmit = async () => {
    if (reportId === null) {
      console.error('Report ID is null');
      return;
    }
      
    setValidatingReportId(true);
    const reports = await fetchReportsById(reportId);
    const report = reports[0];
    setStatus(report?.status || ReportStatus.Invalid);
    setValidatingReportId(false);
     
    if (report?.status === ReportStatus.Redeemed) {
      router.push(`/view-report/${report?.reportId}`);
    }
  };

  const ReportStatusDisplay = () => {
    if (validatingReportId) {
      return (
        <div className="my-4">
          <NotificationBanner type="loading">Validating Report ID...</NotificationBanner>
        </div>
      );
    }
      
    else if (!status) return null;
      
    else if (status === ReportStatus.Redeemed) {
      return (
        <div className="my-4">
          <NotificationBanner type="success">Valid Report ID</NotificationBanner>
        </div>
      );
    }
      
    else if (status === ReportStatus.Unredeemed) {
      return (
        <Link 
          href='/redeem-a-report'
          className="flex justify-between mt-4 p-4 bg-yellow-100 rounded-md text-yellow-800 hover:border hover:border-yellow-800"
        >
          <div className="flex items-center">
            <div className="mr-2">
              <NotebookText className="w-6 h-6 m-1" />
            </div>
            <div className="">
              Report hasn't been redeemed yet.
            </div>
          </div>
          <div className="flex justify-center items-center">
            <div>Redeem Now</div>
            <ArrowRight className="h-5 w-5 ml-2" />
          </div>
        </Link>
      );
    }

    else if (status === ReportStatus.Invalid) {
      return (
        <div className="my-4">
          <NotificationBanner type="error">Invalid Report ID</NotificationBanner>
        </div>
      );
    }
      
    return null;
  };
    
  return (
    <div className={`${roboto.className} min-h-screen px-80 pt-10 flex-row justify-between`}>
      <div className="pt-10">
        <div className="text-4xl mb-8">View an Redeemed Report</div>
        <div className="text-2xl mb-4">Enter Report ID</div>
        <input
          id="reportId"
          type="text"
          value={reportId || ''}
          onChange={handleReportIdChange}
          maxLength={14}
          className="mt-1 block w-full px-3 py-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-black"
          placeholder="XXXX-XXXX-XXXX"
        />

        <ReportStatusDisplay />
          
        <div className="flex justify-end w-full">
          <div className="">            
            <button
              onClick={handleSubmit}
              disabled={reportId?.length !== 14}
              className="mt-4 bg-medium-brown dark:bg-medium-green text-white px-6 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
            >
              View Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}