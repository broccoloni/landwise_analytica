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
    
  const handleReportIdChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); // Only allow uppercase letters and numbers
      
    // Format the value with dashes after every 4 characters
    if (value.length > 3 && !(e.nativeEvent.inputType === 'deleteContentBackward' && value.length === 4)) {
      value = value.slice(0, 4) + '-' + value.slice(4);
    }
    if (value.length > 8 && !(e.nativeEvent.inputType === 'deleteContentBackward' && value.length === 9)) {
      value = value.slice(0, 9) + '-' + value.slice(9);
    }
      
    setReportId(value);
    if (status !== null) setStatus(null);
  };

  const handleSubmit = async () => {
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
        <div className="flex justify-center items-center mt-4 p-4 bg-blue-100 rounded-md text-blue-800">
          <div className="">
            <Loading className="w-10 h-10 mr-2 text-blue-800" />
          </div>
          <div className="">
            Validating Report ID...
          </div>
        </div>
      );
    }
      
    else if (!status) return null;
      
    else if (status === ReportStatus.Redeemed) {
      return (
        <div className="flex justify-center items-center mt-4 p-4 bg-green-100 rounded-md text-dark-green">
          <div className="mr-2 rounded-full border-2 border-dark-green">
            <Check className="w-5 h-5 m-1" />
          </div>
          <div className="">
            Valid Report ID
          </div>
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
        <div className="flex justify-center items-center mt-4 p-4 bg-red-100 rounded-md text-red-800">
          <div className="mr-2 rounded-full border-2 border-red-800">
            <X className="w-5 h-5 m-1" />
          </div>
          <div className="text-red-800">
            Invalid Report ID
          </div>
        </div>
      );
    }
      
    return null;
  };
    
  return (
    <div className={`${roboto.className} min-h-screen px-80 pt-10 flex-row justify-between`}>
      <div className="pt-10">
        <div className="font-bold text-4xl mb-8">View an Existing Report</div>
        <div className="text-2xl font-semibold mb-4">Enter Report ID</div>
        <input
          id="reportId"
          type="text"
          value={reportId || ''}
          onChange={handleReportIdChange}
          maxLength={14}
          className="mt-1 block w-full px-3 py-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="XXXX-XXXX-XXXX"
        />

        <ReportStatusDisplay />
          
        <div className="flex justify-center w-full">
          <div className="">            
            <button
              onClick={handleSubmit}
              disabled={reportId?.length !== 14}
              className="mt-4 bg-medium-brown text-white px-6 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
            >
              View Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}