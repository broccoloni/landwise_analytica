'use client';

import { useState } from 'react';
import { montserrat, roboto, merriweather, raleway } from '@/ui/fonts';
import Link from 'next/link';

export default function Terms() {
  const [reportId, setReportId] = useState('');

  const handleReportIdChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z]/g, ''); // Only allow uppercase letters
      
    // Format the value with dashes after every 4 characters
    if (value.length > 3 && !(e.nativeEvent.inputType === 'deleteContentBackward' && value.length === 4)) {
      value = value.slice(0, 4) + '-' + value.slice(4);
    }
    if (value.length > 8 && !(e.nativeEvent.inputType === 'deleteContentBackward' && value.length === 9)) {
      value = value.slice(0, 9) + '-' + value.slice(9);
    }
      
    setReportId(value);
  };

  const handleSubmit = () => {
    console.log("Submitting report Id:", reportId);
  };
    
  return (
    <div className={`${roboto.className} min-h-screen px-80 pt-10 flex-row justify-between`}>
      <div className="pt-10">
        <div className="font-bold text-4xl mb-8">View an Existing Report</div>
        <div className="text-2xl font-semibold mb-4">Enter Report ID</div>
        <input
          id="reportId"
          type="text"
          value={reportId}
          onChange={handleReportIdChange}
          maxLength={14}
          className="mt-1 block w-full px-3 py-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="XXXX-XXXX-XXXX"
        />

        <div className="flex justify-center w-full">
          <div className="">            
            <button
              onClick={handleSubmit}
              disabled={reportId.length !== 14}
              className="mt-4 bg-medium-brown text-white px-6 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
            >
              View Report
            </button>
          </div>
        </div>
      </div>
        
      <div className="flex text-lg justify-center mt-20">
        <div className="mr-8 my-auto">Quick Links:</div>
        <div className="flex space-x-8 w-96">
          <Link
            href="/get-a-report"
            className="my-auto text-black hover:text-medium-brown hover:underline"
          >
            Get a Report
          </Link>
          <Link
            href="/redeem-a-report"
            className="my-auto text-black hover:text-medium-brown hover:underline"
          >
            Redeem a Report
          </Link>            
        </div> 
      </div>
        
    </div>
  );
}